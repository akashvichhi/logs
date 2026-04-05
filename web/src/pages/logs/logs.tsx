import { Flex, Typography } from 'antd';

import { memo, useCallback, useMemo } from 'react';

import { useGetLogs } from '@src/services/logs';
import type { ILogsSearchParams } from '@src/types/log';

import { DEFAULT_PAGE_SIZE } from './constants';
import LogsFilters from './filters';
import { useLogsFilters } from './hooks';
import LogsTable from './table';

const LogsModule = () => {
  const { filters, handleFilterChange, handleReset } = useLogsFilters();

  const handlePageChange = useCallback(
    (page: number) => {
      handleFilterChange('page', page);
    },
    [handleFilterChange]
  );

  const params = useMemo((): ILogsSearchParams => ({
    query:   filters.query || undefined,
    level:   filters.level || undefined,
    service: filters.service || undefined,
    from_:   filters.dateRange?.[0]?.toISOString() ?? undefined,
    to:      filters.dateRange?.[1]?.toISOString() ?? undefined,
    page:    filters.page,
    limit:   DEFAULT_PAGE_SIZE,
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
          onFilterChange={ handleFilterChange }
          onReset={ handleReset }
        />

        <LogsTable
          data={ data?.results ?? [] }
          isLoading={ isLoading }
          page={ filters.page }
          total={ data?.total ?? 0 }
          onPageChange={ handlePageChange }
        />
      </Flex>
    </Flex >
  );
};

export default memo(LogsModule);
