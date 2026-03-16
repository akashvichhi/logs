import { Card, Flex, Typography } from "antd";
import { useNavigate } from "react-router";

import { memo, useCallback } from "react";

import { NavButton } from "@src/components/ui";
import { ROUTES } from "@src/constants/routes";

import styles from "./styles.module.scss"

import { LoginForm } from ".";

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();

  const afterLogin = useCallback(() => {
    navigate(ROUTES.HOME, { replace: true });
  }, [navigate]);

  return (
    <Flex align="center" className={ styles['login-page'] } justify="center">
      <Card style={ { width: 400 } }>
        <Title level={ 3 }>
              Login
        </Title>
        <LoginForm afterLogin={ afterLogin } />
        <Text type="secondary">
              Don&apos;t have an account?
          <NavButton to={ ROUTES.REGISTER } type='link'>Register</NavButton>
        </Text>
      </Card>
    </Flex>
  )
}

const MemoizedLogin = memo(Login);
export default MemoizedLogin;
