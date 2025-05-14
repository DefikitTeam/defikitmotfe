/* eslint-disable */

import useWindowSize from '@/src/hooks/useWindowSize';
import servicePool from '@/src/services/external-services/backend-server/pool';
import { useAuthLogin } from '@/src/stores/auth/hook';
import { ILoginRequest } from '@/src/stores/auth/type';
import { CaretDownOutlined } from '@ant-design/icons';

import { useConfig } from '@/src/hooks/useConfig';
import { REFCODE_INFO_STORAGE_KEY } from '@/src/services/external-services/backend-server/auth';
import { Chain, ConnectButton } from '@rainbow-me/rainbowkit';
import { Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import NotificationButton from '../notification/notification-button';
import ModalSelectChain from '../ui/ModalSelectChain';
import DisconnectedState from './disconnected-state';
import UnsupportedChainState from './unsupported-chain-state';
import ConnectedState from './connected-state';
import { ConfigService } from '@/src/config/services/config-service';

const ConnectButtonWagmi = () => {
    const { address, isConnected, isConnecting } = useAccount();
    const { isMobile } = useWindowSize();
    const {
        signMessage,
        isSuccess,
        error,
        data,
        isPending,
        reset,
        variables,
        isError,
        isIdle,
        signMessageAsync,
        context
    } = useSignMessage();

    const { chainConfig, defaultChain, supportedChains, supportedChainsNew } =
        useConfig();

    const {
        authState,
        loginAction,
        setOpenModalInviteBlocker,
        resetStatusLoginWalletAction,
        logoutWalletAction,
        logoutTelegramAction,
        logoutDiscordAction,
        logoutTwitterAction,
        resetStatusLoginTeleAction
    } = useAuthLogin();
    const { disconnect } = useDisconnect();

    const [show, setShow] = useState<boolean>(false);
    const [hasAttemptedSignature, setHasAttemptedSignature] = useState(false);
    const handleClickConnectButton = () => {
        setShow(true);
    };

    useEffect(() => {
        const handleSignMessage = async () => {
            if (!authState.userWallet) {
                const message = address as `0x${string}`;
                const refCode = localStorage
                    .getItem(REFCODE_INFO_STORAGE_KEY)
                    ?.replace(/"/g, '');

                try {
                    setHasAttemptedSignature(true);
                    const signature = await signMessageAsync({
                        message: message
                    });

                    const refIdFromStorage = await servicePool.getReferId();
                    const walletData = {
                        chainId: chainConfig?.chainId!,
                        address: address as `0x${string}`,
                        message: message,
                        signature: signature,

                        refId: refIdFromStorage ? refIdFromStorage.refId : ''
                    };

                    const loginWalletData: ILoginRequest = {
                        wallet: walletData,
                        referralCode: refCode ? refCode : ''
                    };
                    logoutDiscordAction();
                    logoutTwitterAction();
                    logoutTelegramAction();
                    loginAction(loginWalletData);
                } catch (error) {
                    console.error('User rejected the signature:', error);
                    disconnect();
                    logoutTelegramAction();
                    logoutDiscordAction();
                    logoutTwitterAction();
                    // prevAddress.current = null;
                }
            }
        };

        // Add a slight delay for mobile devices to ensure wallet is ready
        // if (isMobile) {
        //     setTimeout(() => {
        //         handleSignMessage();
        //     }, 1000);
        // } else {
        // }
        handleSignMessage();
        if (error) {
            console.error('Error signing message:', error);
        }
    }, [address]);

    useEffect(() => {
        if (!isConnected) {
            reset();
            // setShow(false);
        }
    }, [isConnected, reset]);

    const showChainSelector = supportedChainsNew.length > 1;

    return (
        <div className="flex flex-row items-center gap-[3px]">
            <Spin
                spinning={isPending || isConnecting}
                delay={0}
            >
                <ConnectButton.Custom>
                    {({
                        account,
                        chain,
                        openAccountModal,
                        openChainModal,
                        openConnectModal,
                        mounted
                    }) => {
                        const ready = mounted;
                        const connected = ready && account && chain;

                        // if (!ready) {
                        //     return <LoadingPlaceholder />;
                        // }

                        return (
                            <div
                                className="flex items-center gap-4"
                                {...(!ready && {
                                    'aria-hidden': true,
                                    style: {
                                        opacity: 0,
                                        pointerEvents: 'none',
                                        userSelect: 'none'
                                    }
                                })}
                                // onClick={handleClickConnectButton}
                            >
                                {!connected ? (
                                    <DisconnectedState
                                        showChainSelector={showChainSelector}
                                        openConnectModal={openConnectModal}
                                        isMobile={isMobile}
                                    />
                                ) : chain?.unsupported ? (
                                    <UnsupportedChainState
                                        openChainModal={openChainModal}
                                    />
                                ) : (
                                    <ConnectedState
                                        chain={chain}
                                        account={account}
                                        openChainModal={openChainModal}
                                        openAccountModal={openAccountModal}
                                        showChainSelector={showChainSelector}
                                        isMobile={isMobile}
                                    />
                                )}
                            </div>
                        );
                    }}
                </ConnectButton.Custom>
            </Spin>
            {authState.userInfo && <NotificationButton />}
        </div>
    );
};

export default ConnectButtonWagmi;
