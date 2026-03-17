import { App } from 'antd'

import { memo, useEffect } from 'react'

import { setMessageApi } from '@src/utils/ant_message'

const AppInitializer = () => {
  const { message } = App.useApp();

  useEffect(() => {
    setMessageApi(message);
  }, [message]);

  return null;
}

const MemoizedAppInitializer = memo(AppInitializer);
export default MemoizedAppInitializer;
