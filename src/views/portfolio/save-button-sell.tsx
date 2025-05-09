/* eslint-disable */
'use client';
import Loader from '@/src/components/loader';
import { useMultiCaller } from '@/src/hooks/useMultiCaller';
import {
    usePortfolio,
    useSellTokenInformation
} from '@/src/stores/profile/hook';
import { EActionStatus } from '@/src/stores/type';
import { Button, FormInstance, notification, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ISellForm } from './sell-token';
interface ISaveSellPoolButton {
    form: FormInstance<ISellForm>;
    isLoading: boolean;
}

const SaveButtonSell = ({
    text,
    isLoading,
    disableBtnSell,
    clearForm
}: {
    text: string;
    isLoading: boolean;
    disableBtnSell: boolean;
    clearForm?: () => void;
}) => {
    const [data, , resetData] = useSellTokenInformation();
    const [statusLoading, setStatusLoading] = useState(EActionStatus.Idle);
    const [isLoadingSellToken, setIsLoadingSellToken] =
        useState<boolean>(false);
    const t = useTranslations();
    const { address, chainId } = useAccount();
    const [{ portfolio }, fetchPortfolio] = usePortfolio();
    const { status } = portfolio;
    const { createdPools, createdTokens, investedPools } = portfolio;

    const { useSellToken } = useMultiCaller();
    useEffect(() => {
        if (useSellToken.isLoadingInitSellToken) {
            notification.info({
                message: 'Transaction in Progress',
                description:
                    'Please wait while your transaction is being processed.',
                duration: 1.3,
                showProgress: true
            });
        }
    }, [useSellToken.isLoadingInitSellToken]);

    useEffect(() => {
        if (useSellToken.isLoadingAgreedSellToken) {
            setIsLoadingSellToken(true);
            notification.info({
                message: 'Token sell are being processed',
                description: 'Please wait while your token is being processed.',
                duration: 2,
                showProgress: true
            });
        }
    }, [useSellToken.isLoadingAgreedSellToken]);

    useEffect(() => {
        if (useSellToken.isConfirmed) {
            setIsLoadingSellToken(false);
            clearForm && clearForm();
            notification.success({
                message: 'Transaction Success',
                description: 'Sell token successfully.',
                duration: 1.2,
                showProgress: true
            });
            setTimeout(() => {
                fetchPortfolio({
                    chainId: chainId as number,
                    wallet: address as string
                });
            }, 5000);
        }
    }, [useSellToken.isConfirmed]);

    useEffect(() => {
        if (useSellToken.isError) {
            setIsLoadingSellToken(false);
            notification.error({
                message: 'Transaction Failed',
                duration: 3,
                showProgress: true
            });
        }
    }, [useSellToken.isError]);

    const handleSellToken = async () => {
        setIsLoadingSellToken(true);
        try {
            if (!(chainId && address)) {
                notification.error({
                    message: 'Error',
                    description: t('PLEASE_CONNECT_WALLET'),
                    duration: 1,
                    showProgress: true
                });
                return;
            }

            await useSellToken.actionAsync({
                poolAddress: data.poolAddress,
                numberBatch: data.numberBatch
            });
        } catch (err: any) {
            notification.error({
                message: 'Error',
                description: err?.shortMessage || err?.message || 'Error',
                showProgress: true
            });
            setIsLoadingSellToken(false);
        } finally {
            setIsLoadingSellToken(false);
        }
    };

    if (!investedPools || status === EActionStatus.Pending) {
        return <Loader />;
    }

    return (
        <Spin
            spinning={
                isLoading ||
                statusLoading === EActionStatus.Pending ||
                isLoadingSellToken
            }
            delay={0}
        >
            <div className="py-2">
                <Button
                    type="default"
                    className={`w-fit w-full !flex-1 !font-forza text-white transition-opacity`}
                    style={{
                        backgroundColor: '#297fd6',
                        color: 'white',
                        opacity: disableBtnSell === false ? 1 : 0.6,
                        whiteSpace: 'normal',
                        wordWrap: 'break-word'
                    }}
                    size="large"
                    onClick={handleSellToken}
                    disabled={disableBtnSell}
                >
                    {'Sell'} {text}
                </Button>
            </div>
        </Spin>
    );
};

export default SaveButtonSell;
