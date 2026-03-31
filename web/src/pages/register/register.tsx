import { Card, Flex, Typography } from "antd";
import { useNavigate } from "react-router";

import { memo, useCallback } from "react";

import { NavButton } from "@src/components/ui";
import { ROUTES } from "@src/constants/routes";

import styles from "./styles.module.scss";

import { RegisterForm } from ".";

const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();

  const afterRegister = useCallback(() => {
    navigate(ROUTES.LOGIN, { replace: true });
  }, [navigate]);

  return (
    <Flex align="center" className={ styles['register-page'] } justify="center">
      <Card style={ { width: 400 } }>
        <Title level={ 3 }>
          Register
        </Title>
        <RegisterForm afterRegister={ afterRegister } />
        <Text type="secondary">
          Already have an account?
          <NavButton to={ ROUTES.LOGIN } type='link'>Login</NavButton>
        </Text>
      </Card>
    </Flex>
  )
}

export default memo(Register)
