import { Layout } from 'antd';
import { IWorkspaceLayout } from '.';

const Content = ({ children }: IWorkspaceLayout) => {
  return (
    <Layout.Content
    // style={{
    //     // marginLeft: `${sidebarWidth}px`,
    //     transition: `margin-left .15s`,
    // }}
    >
      {children}
    </Layout.Content>
  );
};
export default Content;
