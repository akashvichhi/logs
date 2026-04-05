import { Form, Input } from 'antd';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

import { memo } from 'react';

interface TextFieldProps<T extends FieldValues> {
  name:        Path<T>;
  control:     Control<T>;
  label:       string;
  type?:       HTMLInputElement['type'];
  isPassword?: boolean;
}

// Generic arrow function components lose their generic when wrapped in memo().
// Re-asserting the generic signature on the memoized result preserves JSX
// generic call syntax (<TextField<MyForm> .../>) without unsafe casts at call-sites.
const TextField = <T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  isPassword = false,
}: TextFieldProps<T>) => {
  return (
    <Controller
      control={ control }
      name={ name }
      render={ ({ field, fieldState }) => (
        <Form.Item
          help={ fieldState.error?.message }
          label={ label }
          validateStatus={ fieldState.error ? 'error' : '' }
        >
          { isPassword
            ? <Input.Password { ...field } />
            : <Input { ...field } type={ type } />
          }
        </Form.Item>
      ) }
    />
  );
}

// memo() preserves the generic on function declarations (unlike arrow functions).
export default memo(TextField) as typeof TextField;
