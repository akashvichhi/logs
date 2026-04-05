import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Flex, Input, Select } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';

import { memo, useCallback, useEffect, useState } from 'react';

import { useDebounce } from '@src/hooks/use_debounce';
import type { TLogLevel } from '@src/types/log';

import { LOG_LEVEL_OPTIONS } from './constants';
import styles from './styles.module.scss';
import type { ILogFilterState } from './types';

interface ILogsFiltersProps {
  filters: ILogFilterState;
  onFilterChange: <K extends keyof ILogFilterState>(key: K, value: ILogFilterState[K]) => void;
  onReset: () => void;
}

type TRangeValue = Parameters<NonNullable<RangePickerProps['onChange']>>[0];

const LogsFilters = ({ filters, onFilterChange, onReset }: ILogsFiltersProps) => {
  const [localQuery, setLocalQuery] = useState<string>(filters.query);
  const [localService, setLocalService] = useState<string>(filters.service);

  const debouncedQuery = useDebounce(localQuery, 500);
  const debouncedService = useDebounce(localService, 500);

  useEffect(() => {
    // Prevent infinite loops by checking against parent state
    if (debouncedQuery !== filters.query) {
      onFilterChange('query', debouncedQuery);
    }
  }, [debouncedQuery, filters.query, onFilterChange]);

  useEffect(() => {
    if (debouncedService !== filters.service) {
      onFilterChange('service', debouncedService);
    }
  }, [debouncedService, filters.service, onFilterChange]);

  // 4. HANDLERS (Now incredibly simple)
  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  }, []);

  const handleServiceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalService(e.target.value);
  }, []);

  const handleRangeChange = useCallback((range: TRangeValue) => {
    onFilterChange('dateRange', range ? [range[0], range[1]] : null);
  }, [onFilterChange]);

  const handleLevelChange = useCallback((v: TLogLevel | undefined) => {
    onFilterChange('level', v ?? '');
  }, [onFilterChange]);

  return (
    <Flex gap="small" wrap="wrap">
      <Input.Search
        allowClear
        className={ styles['search-input'] }
        enterButton={ <SearchOutlined /> }
        placeholder="Search message…"
        value={ localQuery }
        onChange={ handleQueryChange }
        onSearch={ (val) => onFilterChange('query', val) } // Bypass debounce on enter
      />

      {/* ... (Other inputs remain exactly the same) */}
      <DatePicker.RangePicker
        allowEmpty
        showTime
        needConfirm={ false }
        value={ filters.dateRange }
        onChange={ handleRangeChange }
      />

      <Select
        allowClear
        className={ styles['level-select'] }
        options={ LOG_LEVEL_OPTIONS }
        placeholder="All Levels"
        value={ filters.level || undefined }
        onChange={ handleLevelChange }
      />

      <Input
        allowClear
        className={ styles['service-input'] }
        placeholder="Service…"
        value={ localService }
        onChange={ handleServiceChange }
      />

      <Button icon={ <ReloadOutlined /> } onClick={ onReset }>
        Reset
      </Button>
    </Flex>
  );
};

export default memo(LogsFilters);