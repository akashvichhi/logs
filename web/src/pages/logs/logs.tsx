import { Flex, Typography } from 'antd';

import { memo, useCallback, useMemo } from 'react';

import { useGetLogs } from '@src/services/logs';
import type { ILogsSearchParams } from '@src/types/log';

import LogsFilters from './filters';
import { useLogsFilters, useRowSelection } from './hooks';
import LogsTable from './table';
import { exportLogsToCsv } from './utils';

const LogsModule = () => {
  const { filters, handleFilterChange, handlePageSizeChange, handleReset } = useLogsFilters();
  const { selectedRows, rowSelection, clearSelection } = useRowSelection();

  const handlePageChange = useCallback(
    (page: number) => {
      handleFilterChange('page', page);
    },
    [handleFilterChange]
  );

  const handleExportCsv = useCallback(() => {
    exportLogsToCsv(selectedRows);
    clearSelection();
  }, [selectedRows, clearSelection]);

  const params = useMemo((): ILogsSearchParams => ({
    query:   filters.query || undefined,
    level:   filters.level || undefined,
    service: filters.service || undefined,
    from_:   filters.dateRange?.[0]?.toISOString() ?? undefined,
    to:      filters.dateRange?.[1]?.toISOString() ?? undefined,
    page:    filters.page,
    limit:   filters.pageSize,
  }), [filters]);

  const { data, isLoading } = useGetLogs(params);

  return (
    <Flex vertical gap="large">
      <Flex vertical gap="small">
        <Typography.Title level={ 3 }>
          System Logs
        </Typography.Title>
        <Typography.Text type="secondary">
          Search and inspect application logs in real time.
        </Typography.Text>
      </Flex>

      <Flex vertical gap="small">
        <LogsFilters
          filters={ filters }
          selectedRowCount={ selectedRows.length }
          onExportCsv={ handleExportCsv }
          onFilterChange={ handleFilterChange }
          onReset={ handleReset }
        />

        <LogsTable
          data={ data?.results ?? [] }
          isLoading={ isLoading }
          page={ filters.page }
          pageSize={ filters.pageSize }
          rowSelection={ rowSelection }
          total={ data?.total ?? 0 }
          onPageChange={ handlePageChange }
          onPageSizeChange={ handlePageSizeChange }
        />
      </Flex>
    </Flex >
  );
};

export default memo(LogsModule);
