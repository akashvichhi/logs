import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useCurrentUser } from '../../services/auth';
import { Spinner } from './Spinner';
import { ROUTES } from '../../constants/routes';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { data, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !data) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

