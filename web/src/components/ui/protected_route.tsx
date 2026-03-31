import { memo, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { ROUTES } from '@src/constants/routes';
import { useCurrentUser } from '@src/services/auth';

import { Loader } from '.';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { data, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !data) {
    return <Navigate replace to={ ROUTES.LOGIN } />;
  }

  return <>{children}</>;
};

export default memo(ProtectedRoute)

