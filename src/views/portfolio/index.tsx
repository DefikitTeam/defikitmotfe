/* eslint-disable */
'use client';
import BoxArea from '@/src/components/common/box-area';
import Loader from '@/src/components/loader';
import useWindowSize from '@/src/hooks/useWindowSize';
import { usePortfolio } from '@/src/stores/profile/hook';
import { EActionStatus } from '@/src/stores/type';
import { Col, notification, Row } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import SellToken from './sell-token';
import Statistical from './statistical';
import YourFriend from './your-friend';

const Portfolio = () => {
    const { isMobile } = useWindowSize();
    const t = useTranslations();
    const { address, chainId } = useAccount();
    const [
        { portfolio },
        fetchPortfolio,
        setIdCurrentChoosedTokenSell,
        fetchYourListFriendAction
    ] = usePortfolio();
    const {
        createdPools,
        createdTokens,
        investedPools,
        priceNative,
        totalInvestedETH,
        status
    } = portfolio;
    const params = useParams();
    const addressParams = params?.walletAddress as string;
    const isAddressDifferent = addressParams && addressParams !== address;
    let walletAddress;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!(address as `0x${string}`) || !chainId) {
            notification.error({
                message: 'Error',
                description: t('PLEASE_CONNECT_WALLET'),
                duration: 1,
                showProgress: true
            });
            return;
        }
        if (addressParams) {
            walletAddress = addressParams;
        } else {
            walletAddress = address;
        }
        if (walletAddress) {
            fetchPortfolio({
                chainId: chainId,
                wallet: walletAddress as `0x${string}`
            });
            fetchYourListFriendAction({
                wallet: walletAddress as `0x${string}`
            });
        }
    }, [address, addressParams, walletAddress, chainId, fetchPortfolio]);

    if (
        // !investedPools ||
        status === EActionStatus.Pending
    ) {
        return <Loader />;
    }

    return (
        <BoxArea>
            <div className={`!pt-[20px] ${isMobile ? '' : 'px-5'}`}>
                <div className="py-2">
                    <Row gutter={[16, 16]}>
                        <Col
                            span={isAddressDifferent ? 24 : 16}
                            xs={24}
                            sm={isAddressDifferent ? 24 : 16}
                            lg={isAddressDifferent ? 24 : 16}
                            md={isAddressDifferent ? 24 : 16}
                            xl={isAddressDifferent ? 24 : 16}
                        >
                            <div className="max-h-[80vh] overflow-y-auto overflow-x-hidden px-2">
                                <Statistical />
                            </div>
                        </Col>
                        {!isAddressDifferent && (
                            <Col
                                span={8}
                                xs={24}
                                sm={8}
                                lg={8}
                                md={8}
                                xl={8}
                            >
                                <SellToken />
                            </Col>
                        )}
                        <Col
                            span={8}
                            xs={24}
                            sm={8}
                            lg={8}
                            md={8}
                            xl={8}
                        >
                            <YourFriend />
                        </Col>
                    </Row>
                </div>
            </div>
        </BoxArea>
    );
};

export default Portfolio;
