/* eslint-disable */
'use client';

import BoxArea from '@/src/components/common/box-area';
import useWindowSize from '@/src/hooks/useWindowSize';
import { Col, notification, Row } from 'antd';
import FaucetInformation from './faucet-information';
import ImageFaucet from './image-faucet';
import useCurrentChainInformation, {
    IChainInfor
} from '@/src/hooks/useCurrentChainInformation';
import NotFoundPage from '@/src/components/errors/not-found';
import { useEffect, useState } from 'react';
import Loader from '@/src/components/common/loader';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useAccount, useSwitchChain } from 'wagmi';
import { chains } from '@/src/common/constant/constance';
import { setChainData } from '@/src/stores/Chain/chainDataSlice';
import { RootState } from '@/src/stores';
import { REFCODE_INFO_STORAGE_KEY } from '@/src/services/external-services/backend-server/auth';
import { useAuthLogin } from '@/src/stores/auth/hook';
import useRefCodeWatcher from '@/src/hooks/useRefCodeWatcher';
import ModalInviteBlocker from '@/src/components/common/invite-blocker';

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
    const { authState, setOpenModalInviteBlocker } = useAuthLogin();
    // useEffect(() => {
    //     const refCodeExisted = localStorage.getItem(REFCODE_INFO_STORAGE_KEY);
    //     if (!refCodeExisted) {
    //         setOpenModalInviteBlocker(true);
    //     }
    // }, []);

    const refCodeExisted = useRefCodeWatcher(REFCODE_INFO_STORAGE_KEY);

    useEffect(() => {
        if (!refCodeExisted) {
            setOpenModalInviteBlocker(true);
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

    useEffect(() => {
        const chainInfo = getCurrentChainUrl();
        if (chainInfo) {
            dispatch(setChainData(chainInfo));
            switchChain({ chainId: chainInfo.chainId });
            // router.push(`${currentPath?.join('/')}?refId=${refId}`);
        }
    }, [currentPath?.[2]]);

    useEffect(() => {
        setOnFaucet(chainData.chainData.onFaucet);
        setLoading(false);
    }, [chainData.chainData.onFaucet]);

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
