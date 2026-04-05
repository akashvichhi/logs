import {
  ApiOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Flex, Layout, Menu, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { useLocation, useNavigate, Outlet } from 'react-router';

import { memo, useCallback, useMemo } from 'react';

import { ROUTES } from '@src/constants/routes';
import { useLogout } from '@src/services/auth';

import styles from './styles.module.scss';

type TMenuItem = Required<MenuProps>['items'][number];

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logoutMutation = useLogout();

  const navItems = useMemo((): TMenuItem[] => [
    {
      key:   ROUTES.HOME,
      icon:  <FileTextOutlined />,
      label: 'System Logs',
    },
    {
      key:   ROUTES.API_KEYS,
      icon:  <ApiOutlined />,
      label: 'API Keys',
    },
  ], []);

  const logoutItems = useMemo((): TMenuItem[] => [
    {
      key:    'logout',
      icon:   <LogoutOutlined />,
      label:  'Logout',
      danger: true,
    },
  ], []);

  const handleNavClick = useCallback<NonNullable<MenuProps['onClick']>>(
    ({ key }) => {
      navigate(key);
    },
    [navigate],
  );

  const handleLogoutClick = useCallback<NonNullable<MenuProps['onClick']>>(
    () => {
      logoutMutation.mutate(undefined, {
        onSettled: () => navigate(ROUTES.LOGIN),
      });
    },
    [logoutMutation, navigate],
  );

  return (
    <Layout className={ styles['layout'] }>
      <Layout.Sider collapsible breakpoint="lg" className={ styles['layout-sider'] }>
        <Flex
          align="center"
          className={ styles['sider-logo'] }
          gap="small"
          justify='center'
        >
          <FileTextOutlined className={ styles['sider-logo-icon'] } />
          <Typography.Title className={ styles['sider-logo-title'] } level={ 5 }>
						Log Viewer
          </Typography.Title>
        </Flex>

        <Flex vertical className={ styles['sider-menu-wrapper'] } justify="space-between">
          <Menu
            items={ navItems }
            mode="inline"
            selectedKeys={ [location.pathname] }
            theme="dark"
            onClick={ handleNavClick }
          />
          <Menu
            items={ logoutItems }
            mode="inline"
            theme="dark"
            onClick={ handleLogoutClick }
          />
        </Flex>
      </Layout.Sider>

      <Layout.Content className={ styles['content'] }>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};

export default memo(AppLayout);
