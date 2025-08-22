import { Typography } from 'antd';
import { ReactNode } from 'react';

const { Title } = Typography;

interface IBoxArea {
  title?: string;
  children: ReactNode;
}

const BoxArea = ({ title, children, ...rest }: IBoxArea) => {
  return (
    <div
      {...rest}
      className="bg-white"
    >
      {title && (
        <div className="shadow-01 py-4 max-[470px]:px-3">
          <Title
            level={5}
            className="mb-0 font-medium"
          >
            {title}
          </Title>
        </div>
      )}
      <div className="p-3">{children}</div>
    </div>
  );
};

export default BoxArea;
