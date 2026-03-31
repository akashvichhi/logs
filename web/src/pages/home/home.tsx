import { Button } from "antd";
import { useNavigate } from "react-router";

import { memo, useCallback } from "react";

import { ROUTES } from "@src/constants/routes";
import { useLogout } from "@src/services/auth";


const Home = () => {
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const handleLogout = useCallback(() => {
    logoutMutation.mutateAsync(undefined, {
      onSettled: () => {
        navigate(ROUTES.LOGIN);
      },
    });
  }, [logoutMutation, navigate]);

  return (
    <div>
      Hello there
      <Button color="danger" variant="text" onClick={ handleLogout }>Logout</Button>
    </div>
  )
}

export default memo(Home)
