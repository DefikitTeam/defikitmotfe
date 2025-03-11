/* eslint-disable */


import {
    ADDRESS_NULL,
} from '@/src/common/constant/constance';
import { useConfig } from '@/src/hooks/useConfig';
import { useMultiCaller } from '@/src/hooks/useMultiCaller';
import { useAuthLogin } from '@/src/stores/auth/hook';
import { useDepositLottery, usePoolDetail } from '@/src/stores/pool/hook';
import { EActionStatus } from '@/src/stores/type';
import { Button, notification, Spin } from 'antd';
import BigNumber from 'bignumber.js';
import { Loader } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const DepositLotteryButton = ({
    disableBtnDeposit
}: {
    disableBtnDeposit: boolean;
}) => {
    const [data, , resetData] = useDepositLottery();

    const [statusLoading, setStatusLoading] = useState(EActionStatus.Idle);
    const { address, chainId, isConnected } = useAccount();
    const [isLoadingDepositLottery, setIsLoadingDepositLottery] =
        useState<boolean>(false);
    const { authState } = useAuthLogin();
    const t = useTranslations();
    const [
        { poolStateDetail },
        fetchPoolDetail,
        fetchPoolDetailBackground,
        fetchHolderDistribution
    ] = usePoolDetail();
    const { status, pool } = poolStateDetail;
    const convertAmountToETH = new BigNumber(data?.depositAmount)
        .times(1e18)
        .toString();

    const { chainConfig } = useConfig();
    const { useDepositForLottery } = useMultiCaller();

    useEffect(() => {
        if (useDepositForLottery.isLoadingInitDepositForLottery) {
            notification.info({
                message: 'Transaction in Progress',
                description:
                    'Please wait while your transaction is being processed.',
                duration: 1.3,
                showProgress: true
            });
        }
    }, [useDepositForLottery.isLoadingInitDepositForLottery]);

    useEffect(() => {
        if (useDepositForLottery.isLoadingAgreedDepositForLottery) {
            setIsLoadingDepositLottery(true);
            notification.info({
                message: 'Deposit Lottery are being processed',
                description:
                    'Please wait while Deposit Lottery is being processed.',
                duration: 2,
                showProgress: true
            });
        }
    }, [useDepositForLottery.isLoadingAgreedDepositForLottery]);

    useEffect(() => {
        if (useDepositForLottery.isConfirmed) {
            setIsLoadingDepositLottery(false);
            resetData();
            notification.success({
                message: 'Transaction Success',
                description: 'Deposit Lottery successfully.',
                duration: 1.2,
                showProgress: true
            });
        }
    }, [useDepositForLottery.isConfirmed]);

    useEffect(() => {
        if (useDepositForLottery.isError && useDepositForLottery.error) {
            setIsLoadingDepositLottery(false);
            console.log(
                'useDepositForLottery.isError line 81---',
                useDepositForLottery.isError
            );
            console.log(useDepositForLottery.error.message);
            notification.error({
                message: 'Transaction Failed',
                duration: 3,
                showProgress: true
            });
        }
    }, [useDepositForLottery.isError, useDepositForLottery.error]);

    const handleButtonDepositLottery = async () => {
        if (!isConnected || !address) {
            notification.error({
                message: 'Error',
                description: 'Please connect to your wallet',
                duration: 3,
                showProgress: true
            });
            return;
        }

        setIsLoadingDepositLottery(true);
        try {
           
            await useDepositForLottery.actionAsync({
                poolAddress: data?.poolAddress,
                amount: convertAmountToETH,
                referrer: authState.userInfo?.referrer
                    ? authState.userInfo?.referrer
                    : ADDRESS_NULL
            });
        } catch (err: any) {
            notification.error({
                message: 'Error',
                description: err?.shortMessage || err?.message || 'Error',
                showProgress: true
            });
            setIsLoadingDepositLottery(false);
        } finally {
            setIsLoadingDepositLottery(false);
        }
    };

    if (!pool || status === EActionStatus.Pending) {
        return <Loader />;
    }

    return (
        <Spin
            spinning={
                statusLoading === EActionStatus.Pending ||
                isLoadingDepositLottery
            }
            delay={0}
        >
            <div className="w-full py-2">
                <Button
                    type="default"
                    size="large"
                    style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        opacity: disableBtnDeposit === true ? 0.6 : 1
                    }}
                    className="w-full transform rounded-full bg-gradient-to-r from-purple-500 to-pink-500 !font-forza !font-forza text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-600 hover:to-pink-600"
                    onClick={handleButtonDepositLottery}
                >
                    Deposit Lottery
                </Button>
            </div>
        </Spin>
    );
};

export default DepositLotteryButton;
