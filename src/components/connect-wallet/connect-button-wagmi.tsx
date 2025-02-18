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

    const [show, setShow] = useState<boolean>(false);
    const handleClickConnectButton = () => {
        setShow(true);
    };

    console.log('show line 50-----', show);
    useEffect(() => {
        if(!show) return;

        const isMetaMaskBrowser = /MetaMask/i.test(navigator.userAgent);
        if (isMetaMaskBrowser) {
            console.log('chay vao metamask');
            return;
        }

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
                    // prevAddress.current = null;
                }
            }
        };

        handleSignMessage();
        if (error) {
            console.error('Error signing message:', error);
        }
    }, [address, show]);

    useEffect(() => {
        if (!isConnected) {
            reset();
            setShow(false);
        }
    }, [isConnected, reset]);

    const showChainSelector = supportedChains.length > 1;

    // return (
    //     <div className="flex flex-row items-center gap-[3px]">
    //         <Spin
    //             spinning={isPending || isConnecting}
    //             delay={0}
    //         >
    //             {/* <ConnectButton /> */}
    //             {currentHostname.url === NEXT_PUBLIC_DOMAIN_MULTIPLE_STG ? (
    //                 <ConnectButton.Custom>
    //                     {({
    //                         account,
    //                         chain,
    //                         openAccountModal,
    //                         openChainModal,
    //                         openConnectModal,
    //                         mounted
    //                     }) => {
    //                         const ready = mounted;
    //                         const connected = ready && account && chain;

    //                         return (
    //                             <div
    //                                 {...(!ready && {
    //                                     'aria-hidden': true,
    //                                     style: {
    //                                         opacity: 0,
    //                                         pointerEvents: 'none',
    //                                         userSelect: 'none'
    //                                     }
    //                                 })}
    //                             >
    //                                 {(() => {
    //                                     if (!connected) {
    //                                         return (
    //                                             <div className="flex items-center gap-4">
    //                                                 <ModalSelectChain />
    //                                                 <button
    //                                                     onClick={
    //                                                         openConnectModal
    //                                                     }
    //                                                     type="button"
    //                                                     className={`rounded-md bg-[#7b3fe4] font-bold text-white ${isMobile ? 'btn-sm gap-1 px-2 py-1 text-xs font-semibold' : 'gap-2 px-4 py-2 text-base'}`}
    //                                                 >
    //                                                     Connect Wallet
    //                                                 </button>
    //                                             </div>
    //                                         );
    //                                     }

    //                                     if (chain.unsupported) {
    //                                         return (
    //                                             <button
    //                                                 onClick={openChainModal}
    //                                                 className="rounded-md bg-[#ff494a] px-4 py-2 font-bold text-white"
    //                                             >
    //                                                 Wrong network
    //                                             </button>
    //                                         );
    //                                     }

    //                                     return (
    //                                         <div className="flex gap-4">
    //                                             <button
    //                                                 onClick={openChainModal}
    //                                                 type="button"
    //                                                 className={`flex items-center gap-2 rounded-md bg-[#1a1b1f] font-bold text-white ${isMobile ? 'btn-sm h-[48px] gap-1 p-2 text-xs font-semibold' : 'h-full gap-2 px-4 py-2 text-base'}`}
    //                                             >
    //                                                 {chain.hasIcon ? (
    //                                                     <div
    //                                                         style={{
    //                                                             background:
    //                                                                 chain.iconBackground,
    //                                                             width: 12,
    //                                                             height: 12,
    //                                                             borderRadius: 999,
    //                                                             overflow:
    //                                                                 'hidden',
    //                                                             marginRight: 4
    //                                                         }}
    //                                                     >
    //                                                         {chain.iconUrl &&
    //                                                             !isMobile && (
    //                                                                 <img
    //                                                                     alt={
    //                                                                         chain.name ??
    //                                                                         'Chain icon'
    //                                                                     }
    //                                                                     src={
    //                                                                         chain.iconUrl
    //                                                                     }
    //                                                                     style={{
    //                                                                         width: 12,
    //                                                                         height: 12
    //                                                                     }}
    //                                                                 />
    //                                                             )}
    //                                                     </div>
    //                                                 ) : (
    //                                                     <div
    //                                                         style={{
    //                                                             width: 12,
    //                                                             height: 12,
    //                                                             borderRadius: 999,
    //                                                             overflow:
    //                                                                 'hidden',
    //                                                             marginRight: 4
    //                                                         }}
    //                                                     >
    //                                                         <img
    //                                                             alt="chain iota"
    //                                                             src="/images/logo-chain-iota.png"
    //                                                             style={{
    //                                                                 width: 12,
    //                                                                 height: 12
    //                                                             }}
    //                                                         />
    //                                                     </div>
    //                                                 )}
    //                                                 {isMobile &&
    //                                                 chain?.name &&
    //                                                 chain?.name?.length > 10 ? (
    //                                                     <p className="text-sm font-semibold">
    //                                                         {chain.name.slice(
    //                                                             0,
    //                                                             8
    //                                                         )}
    //                                                         ...
    //                                                     </p>
    //                                                 ) : (
    //                                                     <p className="text-base font-semibold">
    //                                                         {chain.name}
    //                                                     </p>
    //                                                 )}
    //                                                 <CaretDownOutlined />
    //                                             </button>

    //                                             <button
    //                                                 onClick={openAccountModal}
    //                                                 type="button"
    //                                                 className={`flex h-fit items-center overflow-hidden rounded-md bg-[#1a1b1f] font-bold text-white ${isMobile ? 'btn-sm gap-1 p-0 text-xs font-semibold' : 'gap-2 text-base'}`}
    //                                             >
    //                                                 <div
    //                                                     className={`${isMobile ? 'hidden' : 'px-4 py-2'}`}
    //                                                 >
    //                                                     {account.displayBalance
    //                                                         ? `${account.displayBalance}`
    //                                                         : ''}
    //                                                 </div>
    //                                                 <div className="flex h-full items-center gap-2 bg-[#2f3033] px-4 py-2">
    //                                                     {account.displayName}
    //                                                     <CaretDownOutlined />
    //                                                 </div>
    //                                             </button>
    //                                         </div>
    //                                     );
    //                                 })()}
    //                             </div>
    //                         );
    //                     }}
    //                 </ConnectButton.Custom>
    //             ) : currentHostname.url === NEXT_PUBLIC_DOMAIN_BARTIO_STG ? (
    //                 <ConnectButton.Custom>
    //                     {({
    //                         account,
    //                         chain,
    //                         openAccountModal,
    //                         openChainModal,
    //                         openConnectModal,
    //                         mounted
    //                     }) => {
    //                         const ready = mounted;
    //                         const connected = ready && account && chain;

    //                         return (
    //                             <div
    // {...(!ready && {
    //     'aria-hidden': true,
    //     style: {
    //         opacity: 0,
    //         pointerEvents: 'none',
    //         userSelect: 'none'
    //     }
    // })}
    //                             >
    //                                 {(() => {
    //                                     if (!connected) {
    //                                         return (
    //                                             <div className="flex items-center gap-4">
    //                                                 <ModalSelectChain />
    //                                                 <button
    //                                                     onClick={
    //                                                         openConnectModal
    //                                                     }
    //                                                     type="button"
    //                                                     className={`rounded-md bg-[#7b3fe4] font-bold text-white ${isMobile ? 'btn-sm gap-1 px-2 py-1 text-xs font-semibold' : 'gap-2 px-4 py-2 text-base'}`}
    //                                                 >
    //                                                     Connect Wallet
    //                                                 </button>
    //                                             </div>
    //                                         );
    //                                     }

    //                                     if (chain.unsupported) {
    //                                         return (
    //                                             <button
    //                                                 onClick={openChainModal}
    //                                                 className="rounded-md bg-[#ff494a] px-4 py-2 font-bold text-white"
    //                                             >
    //                                                 Wrong network
    //                                             </button>
    //                                         );
    //                                     }

    //                                     return (
    //                                         <div className="flex gap-4">
    //                                             <button
    //                                                 onClick={openChainModal}
    //                                                 type="button"
    //                                                 className={`flex items-center gap-2 rounded-md bg-[#1a1b1f] font-bold text-white ${isMobile ? 'btn-sm h-[48px] gap-1 p-2 text-xs font-semibold' : 'h-full gap-2 px-4 py-2 text-base'}`}
    //                                             >
    //                                                 {chain.hasIcon && (
    //                                                     <div
    //                                                         style={{
    //                                                             background:
    //                                                                 chain.iconBackground,
    //                                                             width: 12,
    //                                                             height: 12,
    //                                                             borderRadius: 999,
    //                                                             overflow:
    //                                                                 'hidden',
    //                                                             marginRight: 4
    //                                                         }}
    //                                                     >
    //                                                         {chain.iconUrl &&
    //                                                             !isMobile && (
    //                                                                 <img
    //                                                                     alt={
    //                                                                         chain.name ??
    //                                                                         'Chain icon'
    //                                                                     }
    //                                                                     src={
    //                                                                         chain.iconUrl
    //                                                                     }
    //                                                                     style={{
    //                                                                         width: 12,
    //                                                                         height: 12
    //                                                                     }}
    //                                                                 />
    //                                                             )}
    //                                                     </div>
    //                                                 )}
    //                                                 {isMobile &&
    //                                                 chain?.name &&
    //                                                 chain?.name?.length > 10 ? (
    //                                                     <p className="text-sm font-semibold">
    //                                                         {chain.name.slice(
    //                                                             0,
    //                                                             8
    //                                                         )}
    //                                                         ...
    //                                                     </p>
    //                                                 ) : (
    //                                                     <p className="text-base font-semibold">
    //                                                         {chain.name}
    //                                                     </p>
    //                                                 )}
    //                                                 <CaretDownOutlined />
    //                                             </button>

    //                                             <button
    //                                                 onClick={openAccountModal}
    //                                                 type="button"
    //                                                 className={`flex h-fit items-center overflow-hidden rounded-md bg-[#1a1b1f] font-bold text-white ${isMobile ? 'btn-sm gap-1 p-0 text-xs font-semibold' : 'gap-2 text-base'}`}
    //                                             >
    //                                                 <div
    //                                                     className={`${isMobile ? 'hidden' : 'px-4 py-2'}`}
    //                                                 >
    //                                                     {account.displayBalance
    //                                                         ? `${account.displayBalance}`
    //                                                         : ''}
    //                                                 </div>
    //                                                 <div className="flex h-full items-center gap-2 bg-[#2f3033] px-4 py-2">
    //                                                     {account.displayName}
    //                                                     <CaretDownOutlined />
    //                                                 </div>
    //                                             </button>
    //                                         </div>
    //                                     );
    //                                 })()}
    //                             </div>
    //                         );
    //                     }}
    //                 </ConnectButton.Custom>
    //             ) : (
    //                 <ConnectButton />
    //             )}
    //         </Spin>
    //         {authState.userInfo && <NotificationButton />}
    //     </div>
    // );

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
                                onClick={handleClickConnectButton}
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
