import { ApiOutlined, FileTextOutlined } from "@ant-design/icons";
import { Flex, Menu, Typography, type MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router";

import { memo, useCallback, useMemo } from "react";

import { ROUTES } from "@src/constants/routes";

import styles from './styles.module.scss';

type TMenuItem = Required<MenuProps>['items'][number];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ── Sidebar nav items ────────────────────────────────────────────────────
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


  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleNavClick = useCallback<NonNullable<MenuProps['onClick']>>(
    ({ key }) => { navigate(key); },
    [navigate],
  );

  return (
    <div>
      <Flex
        align="center"
        className={ styles['sider-logo'] }
        gap="small"
        justify="center"
      >
        <FileTextOutlined className={ styles['sider-logo-icon'] } />
        <Typography.Title className={ styles['sider-logo-title'] } level={ 5 }>
					Log Viewer
        </Typography.Title>
      </Flex>

      <Flex vertical justify="space-between">
        <Menu
          items={ navItems }
          mode="inline"
          selectedKeys={ [location.pathname] }
          theme="dark"
          onClick={ handleNavClick }
        />
      </Flex>
    </div>
  )
};

export default memo(Sidebar);