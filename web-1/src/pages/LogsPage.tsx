import { useState } from 'react';
import { Button, Card, DatePicker, Input, Pagination, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { useLogs, LogEntry, LogLevel } from '../services/logs';
import { LevelTag } from '../components/ui/LevelTag';

const { RangePicker } = DatePicker;

export const LogsPage = () => {
  const [query, setQuery] = useState<string | undefined>();
  const [level, setLevel] = useState<string | undefined>();
  const [service, setService] = useState<string | undefined>();
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const params = {
    query,
    level,
    service,
    from: range ? range[0].toISOString() : undefined,
    to: range ? range[1].toISOString() : undefined,
    page,
    limit: pageSize,
  };

  const { data, isLoading } = useLogs(params);

  const columns: ColumnsType<LogEntry> = [
    {
      title: 'Time',
      dataIndex: 'timestamp',
      width: 180,
      render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      width: 100,
      render: (value: LogLevel | null) => <LevelTag level={value ?? undefined} />,
    },
    {
      title: 'Service',
      dataIndex: 'service',
      width: 180,
    },
    {
      title: 'Message',
      dataIndex: 'message',
      ellipsis: true,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Input.Search
            placeholder="Search logs (supports AND / OR)"
            allowClear
            style={{ width: 320 }}
            onSearch={(value) => {
              setPage(1);
              setQuery(value || undefined);
            }}
          />
          <Space wrap>
            <RangePicker
              showTime
              value={range as any}
              onChange={(value) => {
                setPage(1);
                setRange(value as [Dayjs, Dayjs] | null);
              }}
            />
            <Select
              allowClear
              placeholder="Level"
              style={{ width: 140 }}
              onChange={(value) => {
                setPage(1);
                setLevel(value);
              }}
              options={[
                { label: 'ERROR', value: 'ERROR' },
                { label: 'WARN', value: 'WARN' },
                { label: 'INFO', value: 'INFO' },
                { label: 'DEBUG', value: 'DEBUG' },
                { label: 'TRACE', value: 'TRACE' },
              ]}
            />
            <Input
              placeholder="Service"
              allowClear
              style={{ width: 180 }}
              onChange={(e) => {
                setPage(1);
                setService(e.target.value || undefined);
              }}
            />
            <Button
              onClick={() => {
                setQuery(undefined);
                setLevel(undefined);
                setService(undefined);
                setRange(null);
                setPage(1);
              }}
            >
              Reset
            </Button>
          </Space>
        </Space>
      </Card>

      <Card>
        <Table<LogEntry>
          rowKey="id"
          loading={isLoading}
          dataSource={data?.results ?? []}
          columns={columns}
          pagination={false}
          expandable={{
            expandedRowRender: (record) =>
              record.metadata ? (
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(record.metadata, null, 2)}
                </pre>
              ) : (
                <span>No metadata</span>
              ),
          }}
          size="middle"
        />
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Pagination
            current={page}
            pageSize={pageSize}
            total={data?.total ?? 0}
            showSizeChanger
            pageSizeOptions={['50', '100', '200', '500']}
            onChange={(p, ps) => {
              setPage(p);
              setPageSize(ps);
            }}
          />
        </div>
      </Card>
    </div>
  );
};

