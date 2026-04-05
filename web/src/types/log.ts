export type TLogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';

export interface ILogEntry {
  id:        number;
  timestamp: string;
  level:     TLogLevel | null;
  service:   string | null;
  message:   string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface ILogsSearchParams {
  query?:   string;
  from_?:   string;
  to?:      string;
  level?:   string;
  service?: string;
  page?:    number;
  limit?:   number;
}

export interface ILogsSearchResponse {
  total:   number;
  page:    number;
  limit:   number;
  results: ILogEntry[];
}
