import { Route, Routes } from "react-router";

import { lazy, Suspense } from "react";

import { Loader , ProtectedRoute } from "./components/ui";
import NotFoundPage from "./pages/error/not_found";

const Home = lazy(() => import("./pages/home/home"));
const Login = lazy(() => import("./pages/login/login"));

const App = () => {
  return (
    <Suspense fallback={ <Loader /> }>
      <Routes>
        <Route
          index
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route element={ <Login /> } path="login" />
        <Route element={ <NotFoundPage /> } path="*" />
      </Routes>
    </Suspense>
  )
}

export default App
