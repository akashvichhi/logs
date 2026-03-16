import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Form, Typography } from "antd";
import { useForm } from "react-hook-form";
import * as yup from 'yup';


import { memo } from "react";

import { TextField } from "@src/components/form";
import { useLogin, type ILoginRequest } from "@src/services/auth";

const { Title } = Typography;

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

interface ILoginFormProps {
  afterLogin: () => void;
}

const LoginForm = ({ afterLogin }: ILoginFormProps) => {
  const { control, handleSubmit } = useForm<ILoginRequest>({
    resolver:      yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const loginMutation = useLogin();

  const onSubmit = (values: ILoginRequest) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        afterLogin();
      },
    });
  };
    
  return (
    <Card style={ { width: 400 } }>
      <Title level={ 3 }>
        Login
      </Title>
      <Form layout="vertical" onFinish={ handleSubmit(onSubmit) }>
        <TextField<ILoginRequest> control={ control } label="Username" name="username" />
        <TextField<ILoginRequest> control={ control } label="Password" name="password" type="password" />
        <Form.Item>
          <Button block htmlType="submit" loading={ loginMutation.isPending } type="primary">
            Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

const MemoizedLoginForm = memo(LoginForm);
export default MemoizedLoginForm as typeof LoginForm;
