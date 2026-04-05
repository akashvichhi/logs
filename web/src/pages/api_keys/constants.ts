import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export const createApiKeySchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(64, 'Name must be at most 64 characters'),
});

// Pre-built resolver — avoids recreating the yup schema on every render
export const createApiKeyResolver = yupResolver(createApiKeySchema);
