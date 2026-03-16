import { useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { useApiKeys, useCreateApiKey, useRevokeApiKey } from '../services/apiKeys';
import { CopyableText } from '../components/ui/CopyableText';

const { Text } = Typography;

export const ApiKeysPage = () => {
  const { data, isLoading } = useApiKeys();
  const createMutation = useCreateApiKey();
  const revokeMutation = useRevokeApiKey();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const handleCreate = () => {
    if (!newKeyName) return;
    createMutation.mutate(newKeyName, {
      onSuccess: (result) => {
        setCreatedKey(result.full_key);
        setNewKeyName('');
      },
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="API Keys"
        extra={
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            New API Key
          </Button>
        }
      >
        <Table
          rowKey="id"
          loading={isLoading}
          dataSource={data ?? []}
          size="middle"
          columns={[
            { title: 'Name', dataIndex: 'name' },
            { title: 'Prefix', dataIndex: 'prefix' },
            {
              title: 'Status',
              dataIndex: 'is_active',
              render: (value: boolean) =>
                value ? <Tag color="green">Active</Tag> : <Tag color="red">Revoked</Tag>,
            },
            {
              title: 'Created At',
              dataIndex: 'created_at',
            },
            {
              title: 'Last Used',
              dataIndex: 'last_used',
              render: (value: string | null) => value ?? 'Never',
            },
            {
              title: 'Actions',
              render: (_, record) =>
                record.is_active ? (
                  <Popconfirm
                    title="Revoke API key"
                    description="Are you sure you want to revoke this key? This action cannot be undone."
                    okText="Yes, revoke"
                    cancelText="Cancel"
                    onConfirm={() => revokeMutation.mutate(record.id)}
                  >
                    <Button danger loading={revokeMutation.isPending}>
                      Revoke
                    </Button>
                  </Popconfirm>
                ) : null,
            },
          ]}
        />
      </Card>

      <Modal
        title="Generate New API Key"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setCreatedKey(null);
          setNewKeyName('');
        }}
        onOk={handleCreate}
        confirmLoading={createMutation.isPending}
        okText={createdKey ? 'Close' : 'Create'}
        okButtonProps={{ disabled: !newKeyName && !createdKey }}
      >
        {!createdKey ? (
          <Form layout="vertical">
            <Form.Item
              label="Name"
              required
              tooltip="Label for this key, e.g. 'my-shop-app'"
            >
              <Input
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="my-shop-app"
              />
            </Form.Item>
          </Form>
        ) : (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>New API Key</Text>
            <CopyableText value={createdKey} />
            <Text type="danger">
              This is the only time the full key will be shown. Copy and store it securely.
            </Text>
          </Space>
        )}
      </Modal>
    </div>
  );
};

