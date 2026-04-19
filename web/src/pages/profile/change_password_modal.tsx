import { Modal } from 'antd';

import { memo } from 'react';

import { ChangePasswordForm } from '.';

interface IChangePasswordModal {
	open: boolean;
	onClose: () => void;
}

const ChangePasswordModal = ({ open, onClose }: IChangePasswordModal) => {
  return (
    <Modal
      footer={ null }
      open={ open }
      title="Change Password"
      width={ 520 }
      onCancel={ onClose }
    >
      <ChangePasswordForm afterSubmit={ onClose } />
    </Modal>
  );
};

export default memo(ChangePasswordModal);
