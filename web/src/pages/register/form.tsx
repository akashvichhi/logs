import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form } from "antd";
import { useForm } from "react-hook-form";
import * as yup from 'yup';

import { memo } from "react";

import { TextField } from "@src/components/form";
import { useRegister, type IRegisterRequest } from "@src/services/auth";

const schema = yup.object({
  username: yup.string().required('Username is required'),
  email:    yup.string().email('Email must be valid').required('Email is required'),
  password: yup.string().required('Password is required'),
});

interface IRegisterFormProps {
  afterRegister: () => void;
}

const RegisterForm = ({ afterRegister }: IRegisterFormProps) => {
  const { control, handleSubmit } = useForm<IRegisterRequest>({
    resolver:      yupResolver(schema),
    defaultValues: {
      username: '',
      email:    '',
      password: '',
    },
  });

  const registerMutation = useRegister();

  const onSubmit = (values: IRegisterRequest) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        afterRegister();
      },
    });
  };

  return (
    <Form layout="vertical" onFinish={ handleSubmit(onSubmit) }>
      <TextField<IRegisterRequest> control={ control } label="Username" name="username" />
      <TextField<IRegisterRequest> control={ control } label="Email" name="email" type="email" />
      <TextField<IRegisterRequest> isPassword control={ control } label="Password" name="password" type="password" />
      <Form.Item>
        <Button block htmlType="submit" loading={ registerMutation.isPending } type="primary">
        Register
        </Button>
      </Form.Item>
    </Form>
  )
}

export default memo(RegisterForm)
