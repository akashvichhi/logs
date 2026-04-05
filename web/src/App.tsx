import { Route, Routes } from "react-router";

import { lazy, Suspense } from "react";

import { AppLayout } from "./components/layouts/app_layout";
import { Loader, ProtectedRoute } from "./components/ui";
import NotFoundPage from "./pages/error/not_found";

const Login = lazy(() => import("./pages/login/login"));
const Register = lazy(() => import("./pages/register/register"));
const ApiKeys = lazy(() => import("./pages/api_keys"));
const Logs = lazy(() => import("./pages/logs"));

const App = () => {
  return (
    <Suspense fallback={ <Loader /> }>
      <Routes>
        {/* Public routes */}
        <Route element={ <Login /> } path="login" />
        <Route element={ <Register /> } path="register" />

        {/* Protected routes — all share AppLayout (Sider + Content) */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={ <Logs /> } />
          <Route element={ <ApiKeys /> } path="api-keys" />
        </Route>

        <Route element={ <NotFoundPage /> } path="*" />
      </Routes>
    </Suspense>
  );
};

export default App;
