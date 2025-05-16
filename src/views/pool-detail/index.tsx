/* eslint-disable */
'use client';
import { chains } from '@/src/common/constant/constance';
import { randomDefaultPoolImage } from '@/src/common/utils/utils';
import BoxArea from '@/src/components/common/box-area';
import CommentTelegram from '@/src/components/common/comment-telegram';
import TradingViewChart from '@/src/components/common/tradingview';
import Loader from '@/src/components/loader';
import { useConfig } from '@/src/hooks/useConfig';
import { IChainInfor } from '@/src/hooks/useCurrentChainInformation';
import useWindowSize from '@/src/hooks/useWindowSize';
import { REFCODE_INFO_STORAGE_KEY } from '@/src/services/external-services/backend-server/auth';
import servicePool, {
    REFERRAL_CODE_INFO_STORAGE_KEY
} from '@/src/services/external-services/backend-server/pool';
import { RootState } from '@/src/stores';
import { useAuthLogin } from '@/src/stores/auth/hook';
import { usePoolDetail } from '@/src/stores/pool/hook';
import { EActionStatus } from '@/src/stores/type';
import { Col, Row } from 'antd';
import { useTranslations } from 'next-intl';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams
} from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import Affiliate from './affiliate';
import HolderDistribution from './holder-distribution';
import PoolDetailInformation from './pool-detail-information';
import PoolPurchaseSummary from './pool-purchase-summary';
import SocialDescInformation from './social-desc-information';
import TokenInformation from './token-information';
import TransactionList from './transaction-list';
import TaskListOwnerToken from './task-list-owner-token';
import RankBadge from '@/src/components/common/rank-badge';
import axios from 'axios';
import AiChatWidget from './ai-chat-widget';

const PoolDetail = () => {
    const t = useTranslations();

    const { isMobile } = useWindowSize();
    const [
        { poolStateDetail },
        fetchPoolDetail,
        ,
        fetchHolderDistribution,
        ,
        ,
        ,
        ,
        resetPoolDetailAction
    ] = usePoolDetail();

    const {
        pool,
        status,
        transactions,
        metaDataInfo,
        dataDetailPoolFromServer
    } = poolStateDetail;

    const params = useParams();
    const poolAddress = params?.poolAddress as string;
    const { isConnected, address } = useAccount();
    const { disconnect } = useDisconnect();
    const [showAlert, setShowAlert] = useState(false);
    const chainData = useSelector((state: RootState) => state.chainData);
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const refId = searchParams?.get(REFERRAL_CODE_INFO_STORAGE_KEY);
    const pathname = usePathname();
    const currentPath = pathname?.split('/');
    const { switchChain } = useSwitchChain();
    const router = useRouter();
    const { authState, setOpenModalInviteBlocker } = useAuthLogin();

    const { chainConfig } = useConfig();
    const getCurrentChainUrl = (): IChainInfor | undefined => {
        return chains.find(
            (item) =>
                item.name.replace(/\s+/g, '').toLowerCase() === currentPath?.[2]
        );
    };

    const [poolRank, setPoolRank] = useState<{
        rank: number;
        total: number;
        trustScore: number;
    } | null>(null);

    useEffect(() => {
        if (refId && !(address as `0x${string}`)) {
            servicePool.storeReferId({
                refId: refId
            });
        }
    }, [refId, poolAddress]);

    useEffect(() => {
        // Force cleanup widget khi vào home
        if (window.AIChatWidget) {
            window.AIChatWidget.destroy?.();
        }
        document
            .querySelectorAll('#ai-chat-widget-container')
            .forEach((e) => e.remove());
        document
            .querySelectorAll('[data-ai-chat-widget]')
            .forEach((e) => e.remove());
    }, []);

    useEffect(() => {
        if (poolAddress && poolStateDetail.pageTransaction !== undefined) {
            fetchPoolDetail({
                page: poolStateDetail.pageTransaction,
                limit: poolStateDetail.limitTransaction,
                poolAddress: poolAddress,
                chainId: chainConfig?.chainId as number
            });
        }
    }, [poolAddress, chainConfig?.chainId, address]);

    // useEffect cho fetchHolderDistribution
    useEffect(() => {
        if (
            poolAddress &&
            poolStateDetail.pageHolderDistribution !== undefined
        ) {
            fetchHolderDistribution({
                page: poolStateDetail.pageHolderDistribution,
                limit: poolStateDetail.limitHolderDistribution,
                poolAddress: poolAddress,
                chainId: chainConfig?.chainId as number
            });
        }
    }, [
        poolAddress,
        chainConfig?.chainId,
        poolStateDetail.pageHolderDistribution
    ]);

    useEffect(() => {
        const url = new URL(window.location.href);
        const searchParams = new URLSearchParams(url.search);
        if (authState.userInfo?.refId) {
            if (searchParams.has('refId')) {
                searchParams.set('refId', authState.userInfo.refId);
            } else {
                searchParams.append('refId', authState.userInfo.refId);
            }

            window.history.replaceState(
                {},
                '',
                `${url.pathname}?${searchParams.toString()}`
            );
        } else {
            searchParams.delete('refId');
            window.history.replaceState(
                {},
                '',
                `${url.pathname}?${searchParams.toString()}`
            );
        }
    }, [authState.userInfo?.refId]);

    useEffect(() => {
        // Fetch pool rank
        const fetchPoolRank = async () => {
            if (!poolAddress) {
                setPoolRank(null);
                return;
            }

            try {
                const res = await servicePool.getRankPool(
                    chainConfig?.chainId.toString()!,
                    poolAddress
                );
                setPoolRank({
                    rank: res.rank,
                    total: res.totalPool,
                    trustScore: res.trustScore
                });
            } catch (e) {
                setPoolRank(null);
            }
        };
        fetchPoolRank();
    }, [poolAddress, chainConfig?.chainId]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (status !== EActionStatus.Succeeded) return;
        if (!pool) return;

        const currentTime = new Date();
        // if (parseInt(pool.startTime) * 1000 > currentTime.getTime()) {
        //     if (!showAlert) {
        //         notification.warning({
        //             message: t('POOL_NOT_STARTED_YET'),
        //             placement: 'top',
        //             duration: 1.5,
        //             showProgress: true
        //         });
        //         setShowAlert(true);
        //     }
        // }
    }, [status, showAlert]);

    useEffect(() => {
        if (status !== EActionStatus.Succeeded || !pool) return;

        const image: any =
            metaDataInfo && metaDataInfo?.image
                ? metaDataInfo?.image
                : metaDataInfo?.tokenImageUrl
                  ? metaDataInfo?.tokenImageUrl
                  : randomDefaultPoolImage();

        let finalImageUrl: string;
        if (typeof image === 'object') {
            finalImageUrl = image.value;
        } else {
            finalImageUrl = image;
        }

        const currentTime = new Date();
        // if (
        //     parseInt(pool.startTime) * 1000 > currentTime.getTime() &&
        //     !showAlert
        // ) {
        //     notification.warning({
        //         message: t('POOL_NOT_STARTED_YET'),
        //         placement: 'top',
        //         duration: 1.5,
        //         showProgress: true
        //     });
        //     setShowAlert(true);
        // }
    }, [status, showAlert, pool, metaDataInfo, t]);

    useEffect(() => {
        const forceReload = () => {
            const script = document.createElement('script');
            script.src = `/path/to/your/script.js?cacheBuster=${Date.now()}`;
            script.async = true;
            document.body.appendChild(script);
        };

        forceReload();
    }, []);

    if (!pool || status === EActionStatus.Pending) {
        return <Loader />;
    }

    return (
        <BoxArea>
            <div className={`!pt-[30px] ${isMobile ? '' : 'px-5'}`}>
                <div className="py-2">
                    <Row gutter={[16, 16]}>
                        <Col
                            span={16}
                            xs={24}
                            sm={16}
                            lg={16}
                            md={16}
                            xl={16}
                        >
                            {/* max-h-[80vh] */}
                            <div
                                className="flex 
                             flex-col gap-6 overflow-y-auto overflow-x-hidden px-2 "
                            >
                                {poolRank && (
                                    <RankBadge
                                        rank={poolRank.rank}
                                        total={poolRank.total}
                                        trustScore={poolRank.trustScore}
                                        type="pool"
                                    />
                                )}
                                <SocialDescInformation />
                                <TradingViewChart
                                    chainId={chainConfig?.chainId!}
                                    poolInfo={pool}
                                />
                                <TokenInformation />
                                <PoolDetailInformation />
                                <TransactionList />
                                {!isMobile ? (
                                    <>
                                        <Affiliate />
                                        {poolStateDetail
                                            .dataDetailPoolFromServer
                                            .discussionId ? (
                                            <CommentTelegram
                                                discussionLink={
                                                    poolStateDetail
                                                        .dataDetailPoolFromServer
                                                        .discussionId
                                                }
                                            />
                                        ) : null}
                                    </>
                                ) : null}
                            </div>
                        </Col>
                        <Col
                            span={8}
                            xs={24}
                            sm={8}
                            lg={8}
                            md={8}
                            xl={8}
                        >
                            <div className="flex flex-col gap-1">
                                <PoolPurchaseSummary />
                                <HolderDistribution />
                                {isConnected &&
                                address &&
                                address.toLowerCase() ===
                                    poolStateDetail.pool?.owner?.toLowerCase() ? (
                                    <TaskListOwnerToken />
                                ) : null}
                                {isMobile ? (
                                    <>
                                        <Affiliate />
                                        {poolStateDetail
                                            .dataDetailPoolFromServer
                                            .discussionId ? (
                                            <CommentTelegram
                                                discussionLink={
                                                    poolStateDetail
                                                        .dataDetailPoolFromServer
                                                        .discussionId
                                                }
                                            />
                                        ) : null}
                                    </>
                                ) : null}

                                {dataDetailPoolFromServer.aiAgentId ? (
                                    <AiChatWidget
                                        key={dataDetailPoolFromServer.aiAgentId}
                                        agentId={
                                            dataDetailPoolFromServer.aiAgentId
                                        }
                                        agentName={
                                            dataDetailPoolFromServer.aiAgentName ??
                                            ''
                                        }
                                    />
                                ) : null}
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* <ModalInviteBlocker /> */}
        </BoxArea>
    );
};

export default PoolDetail;
