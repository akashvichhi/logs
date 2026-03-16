import { App } from 'antd'

// Global reference to message api
let messageApi: ReturnType<typeof App.useApp>['message'] | null = null

export const setMessageApi = (api: ReturnType<typeof App.useApp>['message']) => {
  messageApi = api
}

export const getMessageApi = () => {
  if (!messageApi) throw new Error('Message API not initialized')
  return messageApi
}
