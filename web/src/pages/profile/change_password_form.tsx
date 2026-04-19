import { Button, Flex, Form } from 'antd';
import { useForm } from 'react-hook-form';

import { memo } from 'react';

import { TextField } from '@src/components/form';
import { useChangePassword } from '@src/services/auth';

import { changePasswordResolver } from './schema';
import type { IChangePasswordForm } from './types';

interface IChangePasswordFormProps {
  afterSubmit?: () => void;
}

const ChangePasswordForm = ({ afterSubmit }: IChangePasswordFormProps) => {
  const { mutate: updatePassword, isPending } = useChangePassword();

  const { control, handleSubmit, reset } = useForm<IChangePasswordForm>({
    defaultValues: {
      currentPassword:    '',
      newPassword:        '',
      confirmNewPassword: '',
    },
    resolver: changePasswordResolver,
  });

  // Strip the confirm field before calling the parent callback so the payload
  // matches IChangePasswordPayload (and the backend schema) exactly.
  const handleFormSubmit = handleSubmit(
    (payload: IChangePasswordForm) => {
      updatePassword(payload, {
        onSuccess: () => {
          afterSubmit?.();
          reset();
        },
      });
    },
  );

  return (
    <Form
      id="change-password-form"
      layout="vertical"
      onFinish={ handleFormSubmit }
    >
      <TextField<IChangePasswordForm>
        isPassword
        control={ control }
        label="Current Password"
        name="currentPassword"
      />
      <TextField<IChangePasswordForm>
        isPassword
        control={ control }
        label="New Password"
        name="newPassword"
      />
      <TextField<IChangePasswordForm>
        isPassword
        control={ control }
        label="Confirm New Password"
        name="confirmNewPassword"
      />

      <Flex justify="flex-end">
        <Button
          form="change-password-form"
          htmlType="submit"
          loading={ isPending }
          type="primary"
        >
          Update Password
        </Button>
      </Flex>
    </Form>
  );
};

export default memo(ChangePasswordForm);
