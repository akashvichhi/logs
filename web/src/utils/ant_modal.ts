import { App } from 'antd';

// Global reference to the Ant Design modal API
let modalApi: ReturnType<typeof App.useApp>['modal'] | null = null;

export const setModalApi = (api: ReturnType<typeof App.useApp>['modal']): void => {
  modalApi = api;
};

export const getModalApi = (): ReturnType<typeof App.useApp>['modal'] => {
  if (!modalApi) throw new Error('Modal API not initialized');
  return modalApi;
};
