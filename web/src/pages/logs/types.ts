import type { Dayjs } from 'dayjs';

import type { TLogLevel } from '@src/types/log';

export interface ILogFilterState {
  query:     string;
  level:     TLogLevel | '';
  service:   string;
  dateRange: [Dayjs | null, Dayjs | null] | null;
  page:      number;
}
