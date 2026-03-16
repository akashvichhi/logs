import { Card, Col, Row, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import { useLogs } from '../services/logs';
import { useApiKeys } from '../services/apiKeys';
import { LevelTag } from '../components/ui/LevelTag';

const { Title } = Typography;

export const DashboardPage = () => {
  const now = dayjs();
  const logsAll = useLogs({ page: 1, limit: 1 });
  const logsToday = useLogs({
    from: now.startOf('day').toISOString(),
    to: now.endOf('day').toISOString(),
    page: 1,
    limit: 1,
  });
  const errorsLast24h = useLogs({
    level: 'ERROR',
    from: now.subtract(24, 'hour').toISOString(),
    to: now.toISOString(),
    page: 1,
    limit: 1,
  });
  const recentLogs = useLogs({ page: 1, limit: 10 });
  const apiKeys = useApiKeys();

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        Dashboard
      </Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card title="Total Logs">
            {logsAll.data?.total ?? '—'}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Logs Today">
            {logsToday.data?.total ?? '—'}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Errors Last 24h">
            {errorsLast24h.data?.total ?? '—'}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Active API Keys">
            {apiKeys.data?.filter((k) => k.is_active).length ?? '—'}
          </Card>
        </Col>
      </Row>

      <Card title="Recent Logs">
        <Table
          rowKey="id"
          dataSource={recentLogs.data?.results ?? []}
          pagination={false}
          size="middle"
          columns={[
            {
              title: 'Time',
              dataIndex: 'timestamp',
              render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
              title: 'Level',
              dataIndex: 'level',
              render: (value) => <LevelTag level={value} />,
            },
            {
              title: 'Service',
              dataIndex: 'service',
            },
            {
              title: 'Message',
              dataIndex: 'message',
              ellipsis: true,
            },
          ]}
        />
      </Card>
    </div>
  );
};

