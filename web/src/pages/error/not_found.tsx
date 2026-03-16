import { Result } from "antd";

import { memo } from "react";

import { NavButton } from "@src/components/ui";
import { ROUTES } from "@src/constants/routes";


const NotFound = () => {
  return (
    <Result
      extra={ <NavButton to={ ROUTES.HOME } type="primary">Back Home</NavButton> }
      status="404"
      subTitle="Sorry, the page you are looking for does not exist."
      title="404"
    />
  )
}

const MemoizedNotFound = memo(NotFound);
export default MemoizedNotFound;
