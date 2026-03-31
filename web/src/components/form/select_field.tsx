import { Form, Select } from 'antd';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

import { memo } from 'react';

interface SelectFieldProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label: string
  options: { label: string; value: string | number }[]
}

const SelectField = <T extends FieldValues>({
  name,
  control,
  label,
  options,
}: SelectFieldProps<T>) => (
    <Controller
      control={ control }
      name={ name }
      render={ ({ field, fieldState }) => (
        <Form.Item
          help={ fieldState.error?.message }
          label={ label }
          validateStatus={ fieldState.error ? 'error' : '' }
        >
          <Select { ...field } options={ options } />
        </Form.Item>
      ) }
    />
  );

export default memo(SelectField)
