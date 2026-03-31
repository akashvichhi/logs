import { Button, type ButtonProps } from 'antd'
import { useNavigate } from 'react-router'

import { memo, useCallback } from 'react'

interface NavButtonProps extends ButtonProps {
  to: string;
}

const NavButton = ({ to, ...props }: NavButtonProps) => {
  const navigate = useNavigate();

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement & HTMLButtonElement>) => {
    e.preventDefault();
    navigate(to);
    props.onClick?.(e);
  }, [navigate, to, props]);

  return (
    <Button
      href={ to }
      onClick={ handleClick }
      { ...props }
    />
  )
}

export default memo(NavButton)