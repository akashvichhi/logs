// react-hook-form shape — includes the confirm field needed for client-side validation
export interface IChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Payload sent to the backend — must match ChangePasswordIn (snake_case handled by axios)
export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
