import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Form, Input } from 'antd';

interface TextFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: 'text' | 'password';
}

export const TextField = <T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
}: TextFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <Form.Item
        label={label}
        validateStatus={fieldState.error ? 'error' : ''}
        help={fieldState.error?.message}
      >
        <Input {...field} type={type} />
      </Form.Item>
    )}
  />
);

