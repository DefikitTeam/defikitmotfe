import useWindowSize from '@/src/hooks/useWindowSize';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Typography } from 'antd';
import { ReactElement } from 'react';

interface CommonModalProps {
  open: boolean;
  handleClose?: (event: any) => void;
  title?: string;
  child: ReactElement;
  showButtonFooter?: boolean;
  showIconClose?: boolean;
  btnTitle?: string;
  handleClickCloseIcon?: () => void;
  disableBtnApply?: boolean;
}

const { Title } = Typography;
const CommonModal = (props: CommonModalProps) => {
  const { isMobile } = useWindowSize();
  const {
    child,
    open,
    handleClickCloseIcon,
    title,
    showIconClose,
    disableBtnApply,
    btnTitle,
    showButtonFooter: showButtonClose,
    handleClose
  } = props;

  const inlineStyle = {
    modal: {
      marginTop: '0px !important',
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleClickCloseIcon}
      style={inlineStyle.modal}
    >
      <div
        className={`relative rounded-md bg-[white] p-5 text-center ${
          isMobile ? 'top-[30%]' : 'left-[40%] top-[30%] w-[30%]'
        }`}
      >
        <Form layout="vertical">
          <div className="flex justify-between">
            <Title
              level={3}
              className="!mb-4 !font-forza !text-lg"
            >
              {title}
              {showIconClose && (
                <CloseCircleOutlined
                  className="cursor-pointer shadow hover:shadow-border"
                  onClick={handleClickCloseIcon}
                />
              )}
            </Title>
          </div>
          <div className="mb-7">{child}</div>
          {showButtonClose && (
            <div className="bottom-1 flex items-center justify-center text-center">
              <Button
                disabled={disableBtnApply}
                onClick={handleClose}
                className="bg-#1a489c rounded text-center !font-forza text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-600"
                style={{
                  textTransform: 'capitalize',
                  ...(disableBtnApply && {
                    color: '#ccc!important'
                  })
                }}
              >
                {' '}
                {btnTitle ? btnTitle : 'Apply'}
              </Button>
            </div>
          )}
        </Form>
      </div>
    </Modal>
  );
};

export default CommonModal;
