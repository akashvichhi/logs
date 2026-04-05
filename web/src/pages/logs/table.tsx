import { Table, Tag, Typography } from 'antd';
import type { TableColumnsType } from 'antd';

import { memo, useMemo } from 'react';

import type { ILogEntry, TLogLevel } from '@src/types/log';

import { formatLogTimestamp, getLevelColor } from './utils';

interface ILogsTableProps {
  data:         ILogEntry[];
  isLoading:    boolean;
  total:        number;
  page:         number;
  onPageChange: (page: number) => void;
}

const LogsTable = ({
  data,
  isLoading,
  total,
  page,
  onPageChange,
}: ILogsTableProps) => {
  const columns = useMemo((): TableColumnsType<ILogEntry> => [
    {
      title:     'Timestamp',
      dataIndex: 'timestamp',
      key:       'timestamp',
      width:     200,
      render:    (ts: string) => (
        <Typography.Text type="secondary">
          { formatLogTimestamp(ts) }
        </Typography.Text>
      ),
    },
    {
      title:     'Level',
      dataIndex: 'level',
      key:       'level',
      width:     90,
      render:    (level: TLogLevel | null) =>
        level
          ? <Tag color={ getLevelColor(level) }>{ level }</Tag>
          : <Typography.Text type="secondary">—</Typography.Text>,
    },
    {
      title:     'Service',
      dataIndex: 'service',
      key:       'service',
      width:     150,
      render:    (service: string | null) => (
        <Typography.Text code>{ service ?? '—' }</Typography.Text>
      ),
    },
    {
      title:     'Message',
      dataIndex: 'message',
      key:       'message',
      ellipsis:  true,
      render:    (message: string) => (
        <Typography.Text>{ message }</Typography.Text>
      ),
    },
  ], []);

  const expandable = useMemo(() => ({
    expandedRowRender: (record: ILogEntry) => {
      const meta = record.metadata;
      if (!meta) {
        return (
          <Typography.Text type="secondary">
            No metadata available for this log entry.
          </Typography.Text>
        );
      }
      return (
        <Typography>
          <pre>
            <code>{ JSON.stringify(meta, null, 2) }</code>
          </pre>
        </Typography>
      );
    },
    rowExpandable: (record: ILogEntry) => !!record.metadata,
  }), []);

  const pagination = useMemo(() => ({
    current:         page,
    pageSize:        50,
    total,
    onChange:        onPageChange,
    showSizeChanger: false,
    showTotal:       (t: number) => `${t.toLocaleString()} logs`,
  }), [page, total, onPageChange]);

  return (
    <Table
      columns={ columns }
      dataSource={ data }
      expandable={ expandable }
      loading={ isLoading }
      pagination={ pagination }
      rowKey="id"
      size="small"
    />
  );
};

export default memo(LogsTable);
