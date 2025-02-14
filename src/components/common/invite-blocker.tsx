/* eslint-disable */
import { useNotification } from '@/src/hooks/use-notification';
import useWindowSize from '@/src/hooks/useWindowSize';
import { REFCODE_INFO_STORAGE_KEY } from '@/src/services/external-services/backend-server/auth';
import serviceInviteCode from '@/src/services/external-services/backend-server/invite-code';
import { REFERRAL_CODE_INFO_STORAGE_KEY } from '@/src/services/external-services/backend-server/pool';
import { useAuthLogin } from '@/src/stores/auth/hook';
import { EActionStatus } from '@/src/stores/type';
import { Button, Input, Modal, Spin, Typography, notification } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { useDisconnect } from 'wagmi';
import ConnectButtonWagmi from '../connect-wallet/connect-button-wagmi';

import { useConfig } from '@/src/hooks/useConfig';
import { RootState } from '@/src/stores';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const { Text, Link } = Typography;
const ModalInviteBlocker = () => {
    const t = useTranslations();

    const { isMobile } = useWindowSize();
    const inputRef = useRef<any>(null);
    const [inviteCode, setInviteCode] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const {
        authState,
        setOpenModalInviteBlocker,
        resetStatusLoginWalletAction,
        logoutWalletAction,
        logoutTelegramAction,
        resetStatusLoginTeleAction
    } = useAuthLogin();
    const { openNotification, contextHolder } = useNotification();
    const { disconnect } = useDisconnect();
    const router = useRouter();
    const chainData = useSelector((state: RootState) => state.chainData);
    // useEffect(() => {
    //     localStorage.removeItem('wagmi.store');
    //     localStorage.setItem('wagmi.io.metamask.disconnected', 'true');
    // }, []);

    useEffect(() => {
        if (authState.openModalInviteBlocker) {
            inputRef.current?.focus();
        }
    }, [authState.openModalInviteBlocker]);

    const { chainConfig } = useConfig();

    useEffect(() => {
        // eslint-disable-next-line
        (async () => {
            if (
                authState.statusLoginWallet === EActionStatus.Succeeded &&
                authState.userWallet
            ) {
                // await openNotification({
                //     message: t('LOGIN_WALLET_SUCCESSFULLY'),
                //     placement: 'topRight',
                //     type: 'success'
                // });
                await new Promise((resolve) => setTimeout(resolve, 1000));
                router.push(
                    `/${chainConfig?.name.replace(/\s+/g, '').toLowerCase()}`
                );
                setOpenModalInviteBlocker(false);
                resetStatusLoginWalletAction();
            }

            if (authState.statusLoginWallet === EActionStatus.Failed) {
                if (authState.errorMessage) {
                    await openNotification({
                        message: authState.errorMessage,
                        placement: 'topRight',
                        type: 'error'
                    });
                }
                disconnect();
                logoutWalletAction();
                // logoutAction();
            }
        })();
        // eslint-disable-next-line
    }, [authState.statusLoginWallet]);

    const handleClickInviteCode = async () => {
        setLoading(true);
        const res = await serviceInviteCode.checkInviteCode(inviteCode.trim());
        try {
            if (res && res.success === true) {
                notification.info({
                    message: 'Code is active',
                    description: 'Code is active',
                    duration: 1.3,
                    showProgress: true
                });
                localStorage.setItem(
                    REFCODE_INFO_STORAGE_KEY,
                    JSON.stringify(inviteCode.trim())
                );
                localStorage.setItem(
                    REFERRAL_CODE_INFO_STORAGE_KEY,
                    JSON.stringify(res.data)
                );
                setOpenModalInviteBlocker(false);
                setLoading(false);
            } else if (res && res.success === false) {
                notification.error({
                    message: res.message,
                    duration: 2,
                    showProgress: true
                });
                setLoading(false);
            }
        } catch (error) {
            notification.error({
                message: res.message,
                duration: 2,
                showProgress: true
            });

            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleInviteCodeChange = (
        event:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const { value } = event.target;
        setInviteCode(value);
    };

    return (
        <div>
            <Modal
                title={
                    <span className="flex items-center justify-center !font-forza text-2xl font-bold">
                        {t('INVITE_BLOCKER')}
                    </span>
                }
                open={authState.openModalInviteBlocker}
                // onCancel={handleClose}
                maskClosable={true}
                centered
                width={700}
                footer={null}
                maskStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 1)'
                }}
            >
                <div className="flex h-full  flex-col gap-1 !font-forza">
                    <Input
                        ref={inputRef}
                        size="large"
                        className={`py-2 ${isMobile ? '' : 'm-auto w-[50%]'} !font-forza text-base`}
                        value={inviteCode}
                        onChange={handleInviteCodeChange}
                    />

                    <Text className="!font-forza text-base">
                        {t('CONTENT_INVITE_BLOCKER')}
                    </Text>
                    <Button
                        className="!font-forza text-base"
                        onClick={handleClickInviteCode}
                        disabled={loading}
                        style={{
                            backgroundColor: '#297fd6',
                            color: 'white'
                        }}
                    >
                        {loading && (
                            <Spin
                                size="small"
                                className="mr-2"
                            />
                        )}
                        {t('APPLY')}
                    </Button>
                    <div className="flex flex-col items-center justify-center gap-2 ">
                        <Text className="!font-forza text-2xl">{t('OR')}</Text>
                        <Text className="!font-forza text-base">
                            {t('OR_LOGIN_WITH_WALLET')}
                        </Text>

                        {contextHolder}
                        <ConnectButtonWagmi />
                    </div>

                    <div className="mt-4 flex justify-center gap-4">
                        <Link
                            href="https://x.com/rocketlaunchfun"
                            target="_blank"
                            className="text-blue-500 hover:underline"
                        >
                            Twitter
                        </Link>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ModalInviteBlocker;
