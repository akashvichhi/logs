export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';

export interface LogEntry {
  id: number;
  timestamp: string;
  level: LogLevel | null;
  service: string | null;
  message: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}
