import { Layout, Menu } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { clearToken } from '../utils/token';
import { useQueryClient } from '@tanstack/react-query';
import { ROUTES } from '../constants/routes';

const { Header, Content } = Layout;

export const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = useCallback(() => {
    clearToken();
    queryClient.clear();
    navigate(ROUTES.LOGIN);
  }, [queryClient, navigate]);

  const selectedKey =
    location.pathname.startsWith(ROUTES.LOGS)
      ? 'logs'
      : location.pathname.startsWith(ROUTES.API_KEYS)
      ? 'api-keys'
      : 'dashboard';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ color: '#fff', fontWeight: 600, fontSize: 18 }}>
          logs
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={[
            { key: 'dashboard', label: <Link to={ROUTES.DASHBOARD}>Dashboard</Link> },
            { key: 'logs', label: <Link to={ROUTES.LOGS}>Logs</Link> },
            { key: 'api-keys', label: <Link to={ROUTES.API_KEYS}>API Keys</Link> },
            {
              key: 'logout',
              label: (
                <span
                  onClick={logout}
                  style={{ color: '#ffccc7' }}
                >
                  Logout
                </span>
              ),
            },
          ]}
        />
      </Header>
      <Content>{children}</Content>
    </Layout>
  );
};

