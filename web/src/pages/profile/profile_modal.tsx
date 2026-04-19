import { Modal, Skeleton } from 'antd';

import { memo } from 'react';

import { useCurrentUser } from '@src/services/auth';

import { ProfileDetails } from '.';

interface IProfileModal {
  open: boolean;
  onClose: () => void;
}

const ProfileModal = ({ open, onClose }: IProfileModal) => {
  const { data: profile, isLoading } = useCurrentUser();

  return (
    <Modal
      footer={ null }
      open={ open }
      title="Profile"
      width={ 520 }
      onCancel={ onClose }
    >
      {isLoading || !profile ? (
        <Skeleton active paragraph={ { rows: 4 } } />
      ) : (
        <ProfileDetails profile={ profile } />
      )}
    </Modal>
  );
};

export default memo(ProfileModal);
