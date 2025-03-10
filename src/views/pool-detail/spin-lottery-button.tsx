/* eslint-disable */

import { listChainIdSupported } from '@/src/common/constant/constance';
import Loader from '@/src/components/loader';
import { useMultiCaller } from '@/src/hooks/useMultiCaller';
import { usePoolDetail } from '@/src/stores/pool/hook';
import { EActionStatus } from '@/src/stores/type';
import { Button, notification, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const SpinLotteryButton = () => {
    const [isLoadingSpinLottery, setIsLoadingSpinLottery] =
        useState<boolean>(false);
    const { address, chainId, isConnected } = useAccount();
    const t = useTranslations();
    const [statusLoading, setStatusLoading] = useState(EActionStatus.Idle);

    const [
        { poolStateDetail },
        fetchPoolDetail,
        fetchPoolDetailBackground,
        fetchHolderDistribution
    ] = usePoolDetail();
    const { status, pool } = poolStateDetail;
    const params = useParams();
    const poolAddress = params?.poolAddress as string;
    const { useSpinLottery } = useMultiCaller();
    useEffect(() => {
        if (useSpinLottery.isLoadingInitSpinLottery) {
            setIsLoadingSpinLottery(true);
            notification.info({
                message: 'Spin Lottery in Progress',
                description:
                    'Please wait while Spin lottery is being processed',
                duration: 1.3,
                showProgress: true
            });
        }
    }, [useSpinLottery.isLoadingInitSpinLottery]);

    useEffect(() => {
        if (useSpinLottery.isLoadingAgreedSpinLottery) {
            setIsLoadingSpinLottery(false);
            notification.success({
                message: 'Spin lottery successfully!',
                // description: '',
                duration: 1.2,
                showProgress: true
            });
        }
    }, [useSpinLottery.isLoadingAgreedSpinLottery]);

    useEffect(() => {
        if (useSpinLottery.isError) {
            setIsLoadingSpinLottery(false);
            notification.error({
                message: 'Transaction Failed',
                duration: 3,
                showProgress: true
            });
        }
    }, [useSpinLottery.isError]);

    const handleButtonSpinLottery = async () => {
        if (!isConnected || !address) {
            notification.error({
                message: 'Error',
                description: 'Please connect to your wallet',
                duration: 3,
                showProgress: true
            });
            return;
        }

        setIsLoadingSpinLottery(true);
        try {
            if (!listChainIdSupported.includes(chainId!)) {
                notification.error({
                    message: 'Error',
                    description: t('PLEASE_SWITCH_CHAIN_SYSTEM_SUPPORTED'),
                    duration: 1,
                    showProgress: true
                });
                return;
            }
            await useSpinLottery.actionAsync({
                poolAddress: poolAddress as `0x${string}`
            });
        } catch (err: any) {
            notification.error({
                message: 'Error',
                description: err?.shortMessage || err?.message || 'Error',
                showProgress: true
            });
            setIsLoadingSpinLottery(false);
        } finally {
            setIsLoadingSpinLottery(false);
        }
    };

    if (!pool || status === EActionStatus.Pending) {
        return <Loader />;
    }

    return (
        <Spin
            spinning={
                isLoadingSpinLottery || statusLoading === EActionStatus.Pending
            }
            delay={0}
        >
            <div className="w-full py-2 ">
                <Button
                    type="default"
                    size="large"
                    className="w-full transform rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 !font-forza !font-forza text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-yellow-600 hover:to-orange-600"
                    onClick={handleButtonSpinLottery}
                >
                    Spin Lottery
                </Button>
            </div>
        </Spin>
    );
};

export default SpinLotteryButton;
