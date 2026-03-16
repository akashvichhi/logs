import { Flex } from "antd";
import { useNavigate } from "react-router";

import { memo, useCallback } from "react";

import { ROUTES } from "@src/constants/routes";

import styles from "./styles.module.scss"

import { LoginForm } from ".";

const Login = () => {
  const navigate = useNavigate();

  const afterLogin = useCallback(() => {
    navigate(ROUTES.HOME, { replace: true });
  }, [navigate]);

  return (
    <Flex align="center" className={ styles['login-page'] } justify="center">
      <LoginForm afterLogin={ afterLogin } />
    </Flex>
  )
}

const MemoizedLogin = memo(Login);
export default MemoizedLogin;
