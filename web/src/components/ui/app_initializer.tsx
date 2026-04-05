import { App } from 'antd';

import { memo, useEffect } from 'react';

import { setMessageApi } from '@src/utils/ant_message';
import { setModalApi } from '@src/utils/ant_modal';

const AppInitializer = () => {
  const { message, modal } = App.useApp();

  useEffect(() => {
    setMessageApi(message);
    setModalApi(modal);
  }, [message, modal]);

  return null;
};

export default memo(AppInitializer);
