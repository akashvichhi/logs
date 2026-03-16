import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import { ProtectedRoute } from './components/ui/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LogsPage } from './pages/LogsPage';
import { ApiKeysPage } from './pages/ApiKeysPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RootLayout } from './pages/RootLayout';
import { ROUTES } from './constants/routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  }
});

export const App = () => (
  <ConfigProvider locale={enUS}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <RootLayout>
                  <DashboardPage />
                </RootLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.LOGS}
            element={
              <ProtectedRoute>
                <RootLayout>
                  <LogsPage />
                </RootLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.API_KEYS}
            element={
              <ProtectedRoute>
                <RootLayout>
                  <ApiKeysPage />
                </RootLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </ConfigProvider>
);
