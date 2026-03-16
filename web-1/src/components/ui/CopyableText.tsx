import { Typography } from 'antd';

const { Paragraph } = Typography;

interface CopyableTextProps {
  value: string;
}

export const CopyableText = ({ value }: CopyableTextProps) => (
  <Paragraph copyable={{ text: value }} style={{ marginBottom: 0 }}>
    {value}
  </Paragraph>
);

