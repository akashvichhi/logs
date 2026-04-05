import { DeleteOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tag, Typography } from 'antd';
import type { TableColumnsType } from 'antd';

import { memo, useMemo } from 'react';

import type { IApiKey } from '@src/types/api_key';

import { formatApiKeyDate } from './utils';

interface IApiKeysTableProps {
  data:       IApiKey[];
  isLoading:  boolean;
  isRevoking: boolean;
  onRevoke:   (id: number) => void;
}

const ApiKeysTable = ({ data, isLoading, isRevoking, onRevoke }: IApiKeysTableProps) => {
  const columns = useMemo((): TableColumnsType<IApiKey> => [
    {
      title:     'Name',
      dataIndex: 'name',
      key:       'name',
      render:    (name: string) => (
        <Typography.Text strong>{name}</Typography.Text>
      ),
    },
    {
      title:     'Prefix',
      dataIndex: 'prefix',
      key:       'prefix',
      render:    (prefix: string) => (
        <Typography.Text code>{prefix}</Typography.Text>
      ),
    },
    {
      title:     'Status',
      dataIndex: 'isActive',
      key:       'isActive',
      render:    (isActive: boolean) => (
        <Tag color={ isActive ? 'success' : 'error' }>
          {isActive ? 'Active' : 'Revoked'}
        </Tag>
      ),
    },
    {
      title:     'Created At',
      dataIndex: 'createdAt',
      key:       'createdAt',
      render:    (date: string) => (
        <Typography.Text type="secondary">{formatApiKeyDate(date)}</Typography.Text>
      ),
    },
    {
      title:     'Last Used',
      dataIndex: 'lastUsed',
      key:       'lastUsed',
      render:    (date: string | null | undefined) => (
        <Typography.Text type="secondary">{formatApiKeyDate(date)}</Typography.Text>
      ),
    },
    {
      title:  'Actions',
      key:    'actions',
      render: (_: unknown, record: IApiKey) => (
        <Button
          danger
          icon={ <DeleteOutlined /> }
          loading={ isRevoking }
          size="small"
          onClick={ () => onRevoke(record.id) }
        >
          Revoke
        </Button>
      ),
    },
  ], [onRevoke, isRevoking]);

  return (
    <Table
      columns={ columns }
      dataSource={ data }
      loading={ isLoading }
      pagination={ { pageSize: 20, showSizeChanger: false } }
      rowKey="id"
      size="middle"
    >
      <Table.Summary>
        <Table.Summary.Row>
          <Table.Summary.Cell colSpan={ 6 } index={ 0 }>
            <Space>
              <Typography.Text type="secondary">
                {data.length} key{data.length !== 1 ? 's' : ''} total
              </Typography.Text>
            </Space>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    </Table>
  );
};

export default memo(ApiKeysTable);
