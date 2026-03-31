import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form } from "antd";
import { useForm } from "react-hook-form";
import * as yup from 'yup';


import { memo } from "react";

import { TextField } from "@src/components/form";
import { useLogin, type ILoginRequest } from "@src/services/auth";

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
    <Form layout="vertical" onFinish={ handleSubmit(onSubmit) }>
      <TextField<ILoginRequest> control={ control } label="Username" name="username" />
      <TextField<ILoginRequest> isPassword control={ control } label="Password" name="password" type="password" />
      <Form.Item>
        <Button block htmlType="submit" loading={ loginMutation.isPending } type="primary">
          Login
        </Button>
      </Form.Item>
    </Form>
  )
}

export default memo(LoginForm)
