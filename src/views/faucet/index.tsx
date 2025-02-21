/* eslint-disable */
'use client';

import { chains } from '@/src/common/constant/constance';
import BoxArea from '@/src/components/common/box-area';
import ModalInviteBlocker from '@/src/components/common/invite-blocker';
import Loader from '@/src/components/common/loader';
import NotFoundPage from '@/src/components/errors/not-found';
import { IChainInfor } from '@/src/hooks/useCurrentChainInformation';
import useRefCodeWatcher from '@/src/hooks/useRefCodeWatcher';
import useWindowSize from '@/src/hooks/useWindowSize';
import serviceAuth, {
    REFCODE_INFO_STORAGE_KEY
} from '@/src/services/external-services/backend-server/auth';
import { RootState } from '@/src/stores';
import { useAuthLogin } from '@/src/stores/auth/hook';
import { Col, notification, Row } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import FaucetInformation from './faucet-information';
import ImageFaucet from './image-faucet';

const Faucet = () => {
    const { isMobile } = useWindowSize();
    const chainData = useSelector((state: RootState) => state.chainData);

    const [loading, setLoading] = useState(true);
    const [onFaucet, setOnFaucet] = useState(false);

    const pathname = usePathname();
    const dispatch = useDispatch();
    const currentPath = pathname?.split('/');
    const { switchChain } = useSwitchChain();

    const getCurrentChainUrl = (): IChainInfor | undefined => {
        return chains.find(
            (item) =>
                item.name.replace(/\s+/g, '').toLowerCase() === currentPath?.[2]
        );
    };

    const router = useRouter();

    const { address } = useAccount();
    const { disconnect } = useDisconnect();
    const { authState, setOpenModalInviteBlocker } = useAuthLogin();

    const { value: refCodeExisted, setValue: setRefCodeExisted } =
        useRefCodeWatcher(REFCODE_INFO_STORAGE_KEY);

    useEffect(() => {
        if (
            Boolean(authState.userInfo?.connectedWallet) &&
            Boolean(address) &&
            authState.userInfo?.connectedWallet === address
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
        if (!address) {
            notification.error({
                message: 'Error',
                description: 'Please connect to your wallet',
                duration: 3,
                showProgress: true
            });

            router.push(
                `/${chainData.chainData.name.replace(/\s+/g, '').toLowerCase()}`
            );
            return;
        }
    }, [address]);

    // useEffect(() => {
    //     const chainInfo = getCurrentChainUrl();
    //     if (chainInfo) {
    //         dispatch(setChainData(chainInfo));
    //         switchChain({ chainId: chainInfo.chainId });
    //         // router.push(`${currentPath?.join('/')}?refId=${refId}`);
    //     }
    // }, [currentPath?.[2]]);

    // useEffect(() => {
    //     setOnFaucet(chainData.chainData.onFaucet);
    //     setLoading(false);
    // }, [chainData.chainData.onFaucet]);

    return loading ? (
        <Loader />
    ) : onFaucet ? (
        <BoxArea>
            <div className={`!pt-[20px] ${isMobile ? '' : 'px-5'} `}>
                <div className="py-2">
                    <Row gutter={[8, 10]}>
                        <Col
                            xs={1}
                            sm={2}
                            md={6}
                            lg={1}
                            xl={1}
                            xxl={2}
                        ></Col>
                        <Col
                            xs={22}
                            sm={20}
                            md={12}
                            lg={10}
                            xl={10}
                            xxl={8}
                        >
                            <FaucetInformation />
                        </Col>
                        <Col
                            xs={1}
                            sm={2}
                            md={0}
                            lg={1}
                            xl={1}
                            xxl={2}
                        ></Col>
                        <Col
                            xs={0}
                            sm={0}
                            md={0}
                            lg={3}
                            xl={3}
                            xxl={3}
                        ></Col>

                        <Col
                            xs={0}
                            md={0}
                            sm={0}
                            lg={6}
                            xl={6}
                            xxl={6}
                            // className="h-full"
                        >
                            <ImageFaucet />
                        </Col>
                        <Col
                            xs={0}
                            sm={0}
                            md={0}
                            lg={3}
                            xl={3}
                            xxl={3}
                        ></Col>
                    </Row>
                </div>
            </div>
            <ModalInviteBlocker />
        </BoxArea>
    ) : (
        <NotFoundPage />
    );
};

export default Faucet;
