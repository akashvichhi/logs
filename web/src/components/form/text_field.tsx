import { Form, Input } from 'antd';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

import { memo } from 'react';

interface TextFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: HTMLInputElement['type'];
}

const TextField = <T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
}: TextFieldProps<T>) => (
    <Controller
      control={ control }
      name={ name }
      render={ ({ field, fieldState }) => (
        <Form.Item
          help={ fieldState.error?.message }
          label={ label }
          validateStatus={ fieldState.error ? 'error' : '' }
        >
          <Input { ...field } type={ type } />
        </Form.Item>
      ) }
    />
  );

const MemoizedTextField = memo(TextField);
export default MemoizedTextField as typeof TextField;
