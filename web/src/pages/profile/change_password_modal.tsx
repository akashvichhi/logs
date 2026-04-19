import { Modal } from 'antd';
import { useNavigate } from 'react-router';

import { memo, useCallback } from 'react';

import { ROUTES } from '@src/constants/routes';
import { useLogout } from '@src/services/auth';

import { ChangePasswordForm } from '.';

interface IChangePasswordModal {
	open: boolean;
	onClose: () => void;
}

const ChangePasswordModal = ({ open, onClose }: IChangePasswordModal) => {
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const logout = useCallback(() => {
    logoutMutation.mutate(undefined, {
      onSettled: () => navigate(ROUTES.LOGIN),
    });
  }, [logoutMutation, navigate]);

  return (
    <Modal
      footer={ null }
      open={ open }
      title="Change Password"
      width={ 520 }
      onCancel={ onClose }
    >
      <ChangePasswordForm afterSubmit={ logout } />
    </Modal>
  );
};

export default memo(ChangePasswordModal);
