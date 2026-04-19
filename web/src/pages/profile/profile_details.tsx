import { Descriptions, Typography } from 'antd';

import { memo } from 'react';

import type { IUser } from '@src/types/user';

interface IProfileDetailsProps {
  profile: IUser;
}

const ProfileDetails = ({ profile }: IProfileDetailsProps) => {
  return (
    <Descriptions bordered column={ 1 } size="middle">
      <Descriptions.Item label="Username">
        <Typography.Text strong>{profile.username}</Typography.Text>
      </Descriptions.Item>

      <Descriptions.Item label="Email">
        <Typography.Text>{profile.email}</Typography.Text>
      </Descriptions.Item>

      <Descriptions.Item label="Member Since">
        <Typography.Text>
          {new Date(profile.createdAt).toLocaleDateString('en-US', {
            year:  'numeric',
            month: 'long',
            day:   'numeric',
          })}
        </Typography.Text>
      </Descriptions.Item>
    </Descriptions>
  );
};

export default memo(ProfileDetails);
