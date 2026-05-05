import { useCallback, useState } from 'react';
import type { Key } from 'react';

import type { ILogEntry } from '@src/types/log';

import { DEFAULT_PAGE_SIZE } from './constants';
import type { ILogFilterState } from './types';

const DEFAULT_FILTERS: ILogFilterState = {
  query:     '',
  level:     '',
  service:   '',
  dateRange: null,
  page:      1,
  pageSize:  DEFAULT_PAGE_SIZE,
};

export const useLogsFilters = () => {
  const [filters, setFilters] = useState<ILogFilterState>(DEFAULT_FILTERS);

  // The generic K ensures that the 'value' type perfectly matches the 'key' type
  const handleFilterChange = useCallback(
    <K extends keyof ILogFilterState>(key: K, value: ILogFilterState[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        // Automatically reset to page 1 if a search/filter changes
        ...(key !== 'page' && { page: 1 }),
      }));
    },
    []
  );

  const handlePageSizeChange = useCallback((size: number) => {
    setFilters((prev) => ({ ...prev, pageSize: size, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    filters,
    handleFilterChange,
    handlePageSizeChange,
    handleReset,
  };
};

/**
 * Manages row selection state for the logs table.
 * Exposes a `rowSelection` config object consumable directly by Ant Design’s
 * `<Table rowSelection={...}>` prop, plus helpers for the parent.
 */
export const useRowSelection = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<ILogEntry[]>([]);

  const handleSelectionChange = useCallback(
    (keys: Key[], rows: ILogEntry[]) => {
      setSelectedRowKeys(keys);
      setSelectedRows(rows);
    },
    []
  );

  const clearSelection = useCallback(() => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  }, []);

  const rowSelection = {
    selectedRowKeys,
    onChange:                handleSelectionChange,
    preserveSelectedRowKeys: false,
  } as const;

  return {
    selectedRows,
    rowSelection,
    clearSelection,
  };
};