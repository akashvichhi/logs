import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ConfigProvider, App as AntApp } from 'antd';
import { BrowserRouter } from "react-router";

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { AppInitializer } from './components/ui';
import { antdConfig } from './utils/antd_config';
import "./index.scss";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes,
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={ queryClient }>
        <ConfigProvider theme={ antdConfig }>
          <AntApp
            message={ {
              maxCount: 1,
            } }
          >
            <AppInitializer />
            <App />
          </AntApp>
        </ConfigProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
