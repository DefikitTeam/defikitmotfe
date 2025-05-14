/* eslint-disable */
import useWindowSize from '@/src/hooks/useWindowSize';
import { useSlippage } from '@/src/stores/pool/hook';
import { Button, Input, Modal, Typography, notification } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useAccount } from 'wagmi';
const { Text } = Typography;
const ModalSetMaxSlippage = ({ type }: { type: string }) => {
    const t = useTranslations();
    const { isMobile } = useWindowSize();
    const {
        setOpenModalSettingSlippage,
        setSlippage,
        setSellSlippage,
        slippageState,
        setOpenModalSellSettingSlippage
    } = useSlippage();
    const [amountSlippage, setAmountSlippage] = useState(
        slippageState.slippage
    );
    const [amountSellSlippage, setAmountSellSlippage] = useState(
        slippageState.sellSlippage
    );

    const handleClose = () => {
        if (type === 'buy') {
            setOpenModalSettingSlippage(false);
        } else {
            setOpenModalSellSettingSlippage(false);
        }
    };
    const handleOnChangeSlippageValue = (
        event:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const { value } = event.target;
        if (type === 'buy') {
            setAmountSlippage(Number(value));
        } else {
            setAmountSellSlippage(Number(value));
        }
    };

    const handleClick = () => {
        if (type === 'buy') {
            setSlippage(amountSlippage);
            setOpenModalSettingSlippage(false);
        } else {
            setSellSlippage(amountSellSlippage);
            setOpenModalSellSettingSlippage(false);
        }

        notification.success({
            message: t('CHANGE_SLIPPAGE_SUCCESSFULLY'),
            placement: 'topRight',
            showProgress: true,
            duration: 1
        });
       
    };

    return (
        <Modal
            title={
                <span className="!font-forza text-base font-bold">
                    {t('SET_MAX_SLIPPAGE')}
                </span>
            }
            open={
                type === 'buy'
                    ? slippageState.openModalSlippage
                    : slippageState.openModalSellSippage
            }
            footer={null}
            onCancel={handleClose}
            maskClosable={true}
            centered
        >
            <div className="flex h-full  flex-col gap-1 !font-forza">
                <Input
                    size="large"
                    className={`py-2 ${isMobile ? '' : 'm-auto w-[50%]'} !font-forza text-base`}
                    value={type === 'buy' ? amountSlippage : amountSellSlippage}
                    onChange={handleOnChangeSlippageValue}
                />
                <Text className="!font-forza text-base">
                    {t('CONTENT_SET_MAX_SLIPPAGE')}
                </Text>
                <Button
                    className="!font-forza text-base"
                    onClick={handleClick}
                    style={{
                        backgroundColor: '#297fd6',
                        color: 'white'
                    }}
                >
                    {t('APPLY')}
                </Button>
            </div>
        </Modal>
    );
};

export default ModalSetMaxSlippage;
