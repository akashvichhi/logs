import { LockOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, type MenuProps } from "antd";
import { useNavigate } from "react-router";

import { memo, useCallback, useMemo, useState } from "react"

import { ROUTES } from "@src/constants/routes";
import { ChangePasswordModal, ProfileModal } from "@src/pages/profile";
import { useLogout } from "@src/services/auth";


type TActiveModal = 'profile' | 'change_password' | null;

const Header = () => {
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const [activeModal, setActiveModal] = useState<TActiveModal>(null);

  const logout = useCallback(() => {
    logoutMutation.mutate(undefined, {
      onSettled: () => navigate(ROUTES.LOGIN),
    });
  }, [logoutMutation, navigate]);

  const handleUserMenuClick = useCallback<NonNullable<MenuProps['onClick']>>(
    ({ key }) => {
      if (key === 'profile') { setActiveModal('profile'); return; }
      if (key === 'password') { setActiveModal('change_password'); return; }
      if (key === 'logout') { logout(); }
    },
    [logout],
  );

  const handleCloseModal = useCallback(() => setActiveModal(null), []);

  const userMenuItems = useMemo((): MenuProps['items'] => [
    {
      key:   'profile',
      icon:  <UserOutlined />,
      label: 'Profile',
    },
    {
      key:   'password',
      icon:  <LockOutlined />,
      label: 'Change Password',
    },
    { type: 'divider' },
    {
      key:    'logout',
      icon:   <LogoutOutlined />,
      label:  'Logout',
      danger: true,
    },
  ], []);

  return (
    <div>
      <Dropdown
        menu={ { items: userMenuItems, onClick: handleUserMenuClick } }
        placement="bottomRight"
        trigger={ ['click'] }
      >
        <Button
          icon={ <UserOutlined /> }
          shape='circle'
        />
      </Dropdown>
      {/* ── Profile modal ─────────────────────────────────────────────── */}
      <ProfileModal
        open={ activeModal === 'profile' }
        onClose={ handleCloseModal }
      />

      {/* ── Change Password modal ─────────────────────────────────────── */}
      <ChangePasswordModal
        open={ activeModal === 'change_password' }
        onClose={ handleCloseModal }
      />
    </div>
  )
}

export default memo(Header);

