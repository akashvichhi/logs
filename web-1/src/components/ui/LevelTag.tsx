import { Tag } from 'antd';
import type { LogLevel } from '../../services/logs';

const levelColorMap: Record<LogLevel, string> = {
  ERROR: 'red',
  WARN: 'orange',
  INFO: 'blue',
  DEBUG: 'default',
  TRACE: 'purple',
};

interface LevelTagProps {
  level?: LogLevel | null;
}

export const LevelTag = ({ level }: LevelTagProps) => {
  if (!level) return null;
  return <Tag color={levelColorMap[level]}>{level}</Tag>;
};

