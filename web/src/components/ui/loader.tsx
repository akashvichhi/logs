import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from "antd"


import { memo } from "react";


const Loader = () => {
  return (
    <Spin fullscreen indicator={ <LoadingOutlined spin /> } size="large" />
  )
}

export default memo(Loader)
