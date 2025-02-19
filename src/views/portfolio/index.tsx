/* eslint-disable */
'use client';
import { chains } from '@/src/common/constant/constance';
import BoxArea from '@/src/components/common/box-area';
import ModalInviteBlocker from '@/src/components/common/invite-blocker';
import Loader from '@/src/components/loader';
import { IChainInfor } from '@/src/hooks/useCurrentChainInformation';
import useRefCodeWatcher from '@/src/hooks/useRefCodeWatcher';
import useWindowSize from '@/src/hooks/useWindowSize';
import serviceAuth, {
    REFCODE_INFO_STORAGE_KEY
} from '@/src/services/external-services/backend-server/auth';
import { useAuthLogin } from '@/src/stores/auth/hook';
import { setChainData } from '@/src/stores/Chain/chainDataSlice';
import { useInviteListReferPortfolio } from '@/src/stores/invite-code/hook';
import { usePortfolio } from '@/src/stores/profile/hook';
import { EActionStatus } from '@/src/stores/type';
import { Col, notification, Row } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import SellToken from './sell-token';
import Statistical from './statistical';

const Portfolio = () => {
    const { isMobile } = useWindowSize();
    const t = useTranslations();
    const { disconnect } = useDisconnect();
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

    const [
        { inviteListRefer },
        fetchInviteListRefer,
        setOpenModalInviteListReferAction
    ] = useInviteListReferPortfolio();

    const params = useParams();
    const addressParams = params?.walletAddress as string;
    const isAddressDifferent = addressParams && addressParams !== address;
    let walletAddress;
    const pathname = usePathname();
    const dispatch = useDispatch();
    const currentPath = pathname?.split('/');
    const { switchChain } = useSwitchChain();
    const { authState, setOpenModalInviteBlocker } = useAuthLogin();

    const getCurrentChainUrl = (): IChainInfor | undefined => {
        return chains.find(
            (item) =>
                item.name.replace(/\s+/g, '').toLowerCase() === currentPath?.[2]
        );
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const chainInfo = getCurrentChainUrl();
        if (chainInfo) {
            dispatch(setChainData(chainInfo));
            switchChain({ chainId: chainInfo.chainId });
            // router.push(`${currentPath?.join('/')}?refId=${refId}`);
        }
    }, [currentPath?.[2]]);

    const { value: refCodeExisted, setValue: setRefCodeExisted } = useRefCodeWatcher(REFCODE_INFO_STORAGE_KEY);

    useEffect(() => {
        if (
            Boolean(authState.userInfo?.connectedWallet) &&
            Boolean(address) &&
            authState.userInfo?.connectedWallet === address &&
            !refCodeExisted
        ) {
            setOpenModalInviteBlocker(false);
            return;
        }
        if (!refCodeExisted) {
            setOpenModalInviteBlocker(true);
            disconnect();
        }
    }, [refCodeExisted]);

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

            if (!isAddressDifferent) {
                fetchInviteListRefer({
                    page: inviteListRefer.page,
                    limit: inviteListRefer.limit
                });
            }
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
                            {/* <div className="max-h-[80vh] overflow-y-auto overflow-x-hidden px-2"> */}
                            <div className=" overflow-y-auto overflow-x-hidden px-2">
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
                        {/* <Col
                            span={8}
                            xs={24}
                            sm={8}
                            lg={8}
                            md={8}
                            xl={8}
                        >
                            <YourFriend />
                        </Col> */}

                        {/* <Col
                            span={8}
                            xs={24}
                            sm={8}
                            lg={8}
                            md={8}
                            xl={8}
                        >
                            <ListRefer />
                        </Col> */}
                    </Row>
                </div>
            </div>

            <ModalInviteBlocker />
        </BoxArea>
    );
};

export default Portfolio;
