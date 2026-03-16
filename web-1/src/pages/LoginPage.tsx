import { Card, Typography, Button, Form } from 'antd';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { TextField } from '../components/form/TextField';
import { useLogin } from '../services/auth';
import { ROUTES } from '../constants/routes';

const { Title } = Typography;

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

type LoginFormValues = yup.InferType<typeof schema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const loginMutation = useLogin();

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        navigate(ROUTES.DASHBOARD, { replace: true });
      },
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          logs — Login
        </Title>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <TextField<LoginFormValues> name="username" control={control} label="Username" />
          <TextField<LoginFormValues> name="password" control={control} label="Password" type="password" />
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loginMutation.isPending}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

