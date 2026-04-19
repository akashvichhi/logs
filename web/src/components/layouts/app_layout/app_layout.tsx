import { Layout } from 'antd';
import { Outlet } from 'react-router';

import { memo } from 'react';

import Header from './header';
import Sidebar from './sidebar';
import styles from './styles.module.scss';

const AppLayout = () => {
  return (
    <Layout className={ styles['layout'] }>
      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <Layout.Sider collapsible breakpoint="lg">
        <Sidebar />
      </Layout.Sider>

      {/* ── Main area with header ─────────────────────────────────────── */}
      <Layout>
        <Layout.Header className={ styles['layout-header'] }>
          <Header />
        </Layout.Header>

        <Layout.Content className={ styles['content'] }>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default memo(AppLayout);
