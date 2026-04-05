import { CopyOutlined, KeyOutlined } from '@ant-design/icons';
import { Alert, Button, Flex, Form, Modal, Space, Typography } from 'antd';
import { useForm } from 'react-hook-form';

import { memo, useCallback, useMemo, useState } from 'react';

import { TextField } from '@src/components/form';
import { useCreateApiKey } from '@src/services/api_keys';
import type { IApiKeyWithSecret } from '@src/types/api_key';
import { getMessageApi } from '@src/utils/ant_message';

import { createApiKeyResolver } from './constants';
import type { ICreateApiKeyForm } from './types';

interface ICreateApiKeyModalProps {
  open: boolean;
  onClose: () => void;
}

type TModalView = 'form' | 'success';

const CreateApiKeyForm = ({ open, onClose }: ICreateApiKeyModalProps) => {
  const [view, setView] = useState<TModalView>('form');
  const [createdKey, setCreatedKey] = useState<IApiKeyWithSecret | null>(null);

  const { control, handleSubmit, reset } = useForm<ICreateApiKeyForm>({
    defaultValues: { name: '' },
    resolver:      createApiKeyResolver,
  });

  const createMutation = useCreateApiKey();

  const handleClose = useCallback(() => {
    reset();
    setView('form');
    setCreatedKey(null);
    onClose();
  }, [reset, onClose]);

  const onSubmit = useCallback(
    (formData: ICreateApiKeyForm) => {
      createMutation.mutate(formData.name, {
        onSuccess: (result) => {
          setCreatedKey(result);
          setView('success');
        },
      });
    },
    [createMutation],
  );

  const handleCopy = useCallback(() => {
    if (!createdKey) return;
    void navigator.clipboard.writeText(createdKey.fullKey).then(() => {
      getMessageApi().success('Copied to clipboard!');
    });
  }, [createdKey]);

  const formFooter = useMemo(() => [
    <Button key="cancel" onClick={ handleClose }>
      Cancel
    </Button>,
    <Button
      key="submit"
      form="create-api-key-form"
      htmlType="submit"
      loading={ createMutation.isPending }
      type="primary"
    >
      Create Key
    </Button>,
  ], [handleClose, createMutation.isPending]);

  const successFooter = useMemo(() => [
    <Button key="done" type="primary" onClick={ handleClose }>
      Done
    </Button>,
  ], [handleClose]);

  return (
    <Modal
      destroyOnClose
      footer={ view === 'form' ? formFooter : successFooter }
      open={ open }
      title={ view === 'form' ? 'Create API Key' : 'API Key Created' }
      width={ 480 }
      onCancel={ handleClose }
    >
      {view === 'form' && (
        <Form
          id="create-api-key-form"
          layout="vertical"
          onFinish={ handleSubmit(onSubmit) }
        >
          <TextField<ICreateApiKeyForm>
            control={ control }
            label="Key Name"
            name="name"
          />
          <Typography.Text type="secondary">
            Give your key a descriptive name, e.g. &quot;CI/CD Pipeline&quot; or &quot;Mobile App&quot;.
          </Typography.Text>
        </Form>
      )}

      {view === 'success' && createdKey && (
        <Flex vertical gap="middle">
          <Alert
            showIcon
            message="Save this key — it won't be shown again"
            type="warning"
          />
          <Flex vertical gap="small">
            <Typography.Text type="secondary">Your new API key:</Typography.Text>
            <Space>
              <Typography.Text code ellipsis copyable={ false }>
                {createdKey.fullKey}
              </Typography.Text>
              <Button icon={ <CopyOutlined /> } size='small' onClick={ handleCopy }>
                Copy
              </Button>
            </Space>
          </Flex>
          <Flex align="center" gap="small">
            <KeyOutlined />
            <Typography.Text type="secondary">
              Prefix:{' '}
              <Typography.Text code>{createdKey.prefix}</Typography.Text>
            </Typography.Text>
          </Flex>
        </Flex>
      )}
    </Modal>
  );
};

export default memo(CreateApiKeyForm);
