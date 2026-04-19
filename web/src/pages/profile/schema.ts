import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// ---------------------------------------------------------------------------
// Validation schema — defined outside component scope so yup never rebuilds it
// ---------------------------------------------------------------------------
export const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Current password is required.'),

  newPassword: yup
    .string()
    .required('New password is required.')
    .min(8, 'Password must be at least 8 characters.'),

  confirmNewPassword: yup
    .string()
    .required('Please confirm your new password.')
    .oneOf([yup.ref('newPassword')], 'Passwords do not match.'),
});

// Pre-built resolver — prevents the schema from being reconstructed on each render
export const changePasswordResolver = yupResolver(changePasswordSchema);
