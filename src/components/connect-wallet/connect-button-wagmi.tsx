/* eslint-disable */

import useWindowSize from '@/src/hooks/useWindowSize';
import servicePool from '@/src/services/external-services/backend-server/pool';
import { useAuthLogin } from '@/src/stores/auth/hook';
import { ILoginRequest } from '@/src/stores/auth/type';

import { useConfig } from '@/src/hooks/useConfig';
import { REFCODE_INFO_STORAGE_KEY } from '@/src/services/external-services/backend-server/auth';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Spin } from 'antd';
import { useEffect } from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import NotificationButton from '../notification/notification-button';
import ConnectedState from './connected-state';
import DisconnectedState from './disconnected-state';
import UnsupportedChainState from './unsupported-chain-state';

const ConnectButtonWagmi = () => {
    const { address, isConnected, isConnecting } = useAccount();
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

    const { chainConfig, defaultChain, environment, supportedChains } =
        useConfig();

    const { authState, loginAction } = useAuthLogin();
    const { disconnect } = useDisconnect();
    const { isMobile } = useWindowSize();

    useEffect(() => {
        const handleSignMessage = async () => {
            if ((address as `0x${string}`) && !authState.userWallet) {
                const message = address as `0x${string}`;
                const refCode = localStorage
                    .getItem(REFCODE_INFO_STORAGE_KEY)
                    ?.replace(/"/g, '');

                try {
                    const signature = await signMessageAsync({
                        message: message
                    });

                    const refIdFromStorage = await servicePool.getReferId();
                    const loginWalletData: ILoginRequest = {
                        wallet: {
                            chainId: chainConfig?.chainId!,
                            address: address as `0x${string}`,
                            message: message,
                            signature: signature,

                            refId: refIdFromStorage
                                ? refIdFromStorage.refId
                                : ''
                        },
                        referralCode: refCode ? refCode : ''
                    };
                    loginAction(loginWalletData);
                } catch (error) {
                    console.error('User rejected the signature:', error);
                    disconnect();
                }
            }
        };

        handleSignMessage();
        if (error) {
            console.error('Error signing message:', error);
        }
    }, [address]);

    useEffect(() => {
        if (!isConnected) {
            reset();
        }
    }, [isConnected, reset]);

    const showChainSelector = supportedChains.length > 1;

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
