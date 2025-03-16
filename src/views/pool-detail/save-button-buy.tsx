/* eslint-disable */
import { ADDRESS_NULL, ChainId } from '@/src/common/constant/constance';
import Loader from '@/src/components/loader';
import { useConfig } from '@/src/hooks/useConfig';
import { useMultiCaller } from '@/src/hooks/useMultiCaller';
import { useAuthLogin } from '@/src/stores/auth/hook';
import {
    useActivities,
    useBuyPoolInformation,
    usePoolDetail
} from '@/src/stores/pool/hook';
import { EActionStatus } from '@/src/stores/type';
import { ExportOutlined } from '@ant-design/icons';
import { Button, Spin, notification } from 'antd';
import BigNumber from 'bignumber.js';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const SaveButtonBuy = ({
    text,
    isLoading,
    disableBtnBuy,
    clearForm,
    isTradeBex
}: {
    text: string;
    isLoading: boolean;
    disableBtnBuy: boolean;
    clearForm?: () => void;
    isTradeBex: boolean;
}) => {
    const [data, , resetData] = useBuyPoolInformation();
    const [statusLoading, setStatusLoading] = useState(EActionStatus.Idle);
    const { address, chainId, isConnected } = useAccount();
    const [isLoadingBuyToken, setIsLoadingBuyToken] = useState<boolean>(false);
    const { authState } = useAuthLogin();
    const t = useTranslations();

    const convertMaxAmountToETH = new BigNumber(data?.maxAmountETH)
        .div(1e18)
        .toString();

    const { chainConfig, getDexInfo } = useConfig();
    const [
        { poolStateDetail },
        fetchPoolDetail,
        fetchPoolDetailBackground,
        fetchHolderDistribution
    ] = usePoolDetail();
    const { status, pool } = poolStateDetail;
    const params = useParams();
    const poolAddress = params?.poolAddress as string;

    const { useBuyPoolMulti } = useMultiCaller();
    const [hasNotified, setHasNotified] = useState<boolean>(false);

    useEffect(() => {
        if (useBuyPoolMulti.isLoadingInitBuyToken) {
            notification.info({
                message: 'Transaction in Progress',
                description:
                    'Please wait while your transaction is being processed.',
                duration: 1.3,
                showProgress: true
            });
        }
    }, [useBuyPoolMulti.isLoadingInitBuyToken]);

    useEffect(() => {
        if (useBuyPoolMulti.isLoadingAgreedBuyToken) {
            setIsLoadingBuyToken(true);
            notification.info({
                message: 'Token purchases are being processed',
                description: 'Please wait while your token is being processed.',
                duration: 2,
                showProgress: true
            });
        }
    }, [useBuyPoolMulti.isLoadingAgreedBuyToken]);

    useEffect(() => {
        if (useBuyPoolMulti.isConfirmed && !hasNotified) {
            setIsLoadingBuyToken(false);
            clearForm && clearForm();
            notification.success({
                message: 'Transaction Success',
                description: 'Buy token successfully.',
                duration: 1.2,
                showProgress: true
            });
            setHasNotified(true);

            setTimeout(() => {
                fetchPoolDetailBackground({
                    page: poolStateDetail.pageTransaction,
                    limit: poolStateDetail.limitTransaction,
                    poolAddress: poolAddress,
                    chainId: chainConfig?.chainId as number
                });
                fetchHolderDistribution({
                    page: poolStateDetail.pageHolderDistribution,
                    limit: poolStateDetail.limitHolderDistribution,
                    poolAddress: poolAddress,
                    chainId: chainConfig?.chainId as number
                });
            }, 10000);
        }
        if (!useBuyPoolMulti.isConfirmed) {
            setHasNotified(false);
        }
    }, [useBuyPoolMulti.isConfirmed, status]);

    useEffect(() => {
        if (useBuyPoolMulti.isError) {
            setIsLoadingBuyToken(false);
            notification.error({
                message: 'Transaction Failed',
                duration: 3,
                showProgress: true
            });
        }
    }, [useBuyPoolMulti.isError]);

    const handleBuyPool = async () => {
        setIsLoadingBuyToken(true);

        try {
            await useBuyPoolMulti.actionAsync({
                poolAddress: data?.poolAddress,
                numberBatch: data?.numberBatch,
                maxAmountETH: convertMaxAmountToETH,
                referrer: authState.userInfo?.referrer
                    ? authState.userInfo?.referrer
                    : ADDRESS_NULL
            });
            // clearForm && clearForm();
        } catch (err: any) {
            notification.error({
                message: 'Error',
                description: err?.shortMessage || err?.message || 'Error',
                showProgress: true
            });
            setIsLoadingBuyToken(false);
        } finally {
            setIsLoadingBuyToken(false);
        }
    };

    const handleButtonBuyPoolOrTrade = () => {
        if (!isConnected || !address) {
            notification.error({
                message: 'Error',
                description: 'Please connect to your wallet',
                duration: 3,
                showProgress: true
            });
            return;
        }

        if (isTradeBex) {
            if (Number(pool?.startTime) < 1736496722) {
                window.open(
                    t('LINK_TRADE_ON_KADIAK') + `${poolAddress}`,
                    '_blank',
                    'noopener,noreferrer'
                );
            } else {
                window.open(
                    `${getDexInfo(chainConfig?.chainId || 0)?.linkSwap || ''}${poolAddress}`,
                    '_blank',
                    'noopener,noreferrer'
                );
            }
        } else {
            handleBuyPool();
        }
    };

    if (!pool || status === EActionStatus.Pending) {
        return <Loader />;
    }

    return (
        <Spin
            spinning={
                isLoading ||
                statusLoading === EActionStatus.Pending ||
                isLoadingBuyToken
            }
            delay={0}
        >
            <div className="py-2">
                <Button
                    type="default"
                    className={` !mt-2 w-full  !font-forza text-white transition-opacity`}
                    style={{
                        backgroundColor: '#297fd6',
                        color: 'white',
                        opacity:
                            disableBtnBuy === true && isTradeBex === false
                                ? 0.6
                                : 1,
                        whiteSpace: 'normal',
                        wordWrap: 'break-word'
                    }}
                    size="large"
                    onClick={handleButtonBuyPoolOrTrade}
                    disabled={disableBtnBuy === true && isTradeBex === false}
                >
                    {isTradeBex ? (
                        <div className="flex items-center justify-center gap-2">
                            <span>
                                {Number(pool.startTime) < 1736496722
                                    ? 'Trade on Kodiak'
                                    : `Trade on ${getDexInfo(chainConfig?.chainId || 0)?.name || 'DEX'}`}
                            </span>
                            {chainConfig?.chainId === ChainId.MONAD && (
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(
                                            'https://www.defined.fi/mon-test/0xc0ce32eee0eb8bf24fa2b00923a78abc5002f91e?quoteToken=token1',
                                            '_blank',
                                            'noopener,noreferrer'
                                        );
                                    }}
                                    className="flex cursor-pointer items-center transition-opacity hover:opacity-80"
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="2"
                                        className="ml-1"
                                    >
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line
                                            x1="10"
                                            y1="14"
                                            x2="21"
                                            y2="3"
                                        />
                                    </svg>
                                </span>
                            )}
                        </div>
                    ) : (
                        `Buy ${text}`
                    )}
                </Button>
            </div>
        </Spin>
    );
};

export default SaveButtonBuy;
