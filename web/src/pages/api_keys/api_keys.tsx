import { PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Typography } from 'antd';

import { memo, useCallback, useState } from 'react';

import { useGetApiKeys , useRevokeApiKey } from '@src/services/api_keys';
import { getModalApi } from '@src/utils/ant_modal';

import CreateApiKeyForm from './form';
import ApiKeysTable from './table';

const ApiKeysModule = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data = [], isLoading } = useGetApiKeys();
  const revokeMutation            = useRevokeApiKey();

  const handleOpenModal  = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  const handleRevoke = useCallback(
    (id: number) => {
      getModalApi().confirm({
        title:         'Revoke API Key',
        content:       'This key will stop working immediately and cannot be un-revoked.',
        okText:        'Yes, revoke it',
        okButtonProps: { danger: true },
        cancelText:    'Cancel',
        onOk:          () => { revokeMutation.mutate(id); },
      });
    },
    [revokeMutation],
  );

  return (
    <Flex vertical gap="large">
      <Flex align="center" justify="space-between">
        <Flex vertical gap="small">
          <Typography.Title level={ 3 }>
            API Keys
          </Typography.Title>
          <Typography.Text type="secondary">
            Manage programmatic access to the API.
          </Typography.Text>
        </Flex>
        <Button
          icon={ <PlusOutlined /> }
          type="primary"
          onClick={ handleOpenModal }
        >
          Create API Key
        </Button>
      </Flex>

      <ApiKeysTable
        data={ data }
        isLoading={ isLoading }
        isRevoking={ revokeMutation.isPending }
        onRevoke={ handleRevoke }
      />

      <CreateApiKeyForm
        open={ isModalOpen }
        onClose={ handleCloseModal }
      />
    </Flex>
  );
};

export default memo(ApiKeysModule);
