/* eslint-disable */
import { REGEX_WALLET_ADDRESS } from '@/src/common/constant/constance';
import { useNotification } from '@/src/hooks/use-notification';
import { useConfig } from '@/src/hooks/useConfig';
import useWindowSize from '@/src/hooks/useWindowSize';
import serviceFaucet from '@/src/services/external-services/backend-server/faucet';
import { useAuthLogin } from '@/src/stores/auth/hook';
import { EActionStatus } from '@/src/stores/type';
import { CheckCircleFilled } from '@ant-design/icons';
import { Button, Col, Input, notification, Row, Spin, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
const { Text, Title } = Typography;
const FaucetInformation = () => {
    const { address, chainId, isConnected } = useAccount();
    const t = useTranslations();
    const { disconnect } = useDisconnect();

    const { chainConfig } = useConfig();
    const { isMobile } = useWindowSize();
    const router = useRouter();
    const [walletAddress, setWalletAddress] = useState('');
    const [isClickFollow, setIsClickFollow] = useState<boolean>(false);
    const [isLoadingFaucet, setIsLoadingFaucet] = useState<boolean>(false);
    const [validateInput, setValidateInput] = useState({
        walletAddress: {
            error: false,
            helperText: ''
        }
    });
    const { openNotification, contextHolder } = useNotification();

    const {
        authState,
        loginAction,
        logoutTelegramAction,
        logoutWalletAction,
        logoutDiscordAction,
        logoutTwitterAction,
        resetStatusLoginTeleAction,
        resetStatusLoginWalletAction
    } = useAuthLogin();
    const [isDoneFaucet, setIsDoneFaucet] = useState<boolean>(false);

    const checkIsSaveInfoUserWithTelegram = authState.userTele;
    const isUserInfoSavedWithTelegram =
        checkIsSaveInfoUserWithTelegram &&
        authState.userInfo &&
        authState.userInfo?.connectedWallet === address &&
        authState.userInfo?.chainId === chainId;

    useEffect(() => {
        if (!(address as `0x${string}`)) {
            setWalletAddress('');
            setIsClickFollow(false);
            setIsDoneFaucet(false);
        } else {
            setWalletAddress(address as string);
        }
    }, [address]);

    const onChange = (
        event:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        if (!(chainId && address)) {
            notification.error({
                message: 'Error',
                description: t('PLEASE_CONNECT_WALLET'),
                duration: 2,
                showProgress: true
            });
            return;
        }
        const { name, value } = event.target;
        let validateInputError = false;
        let validateInputHelperText = '';
        setWalletAddress(value);
        if (!REGEX_WALLET_ADDRESS.test(value)) {
            validateInputError = true;
            validateInputHelperText = t('INVALID_WALLET_ADDRESS');
        } else {
            validateInputError = false;
            validateInputHelperText = '';
        }
        setValidateInput({
            ...validateInput,
            walletAddress: {
                error: validateInputError,
                helperText: validateInputHelperText
            }
        });
    };
    const handleClickFollowRocketLaunch = () => {
        window.open(t('ROCKET_LAUNCH_LINK'), '_blank', 'noopener,noreferrer');
        setIsClickFollow(true);
    };
    const handleClickCreateRocketLaunch = () => {
        if (isConnected && address) {
            router.push('/create-launch');
        }
        notification.error({
            message: 'Error',
            description: t('PLEASE_CONNECT_WALLET'),
            duration: 2,
            showProgress: true
        });
        return;
    };

    const handleSubmitFaucet = async () => {
        // if (isConnected && address) {
        setIsLoadingFaucet(true);
        const res = await serviceFaucet.getFaucet(
            address as string,
            chainConfig?.chainId!
        );
        try {
            if (res && res.status === 'success') {
                setIsLoadingFaucet(false);
                setIsDoneFaucet(true);
            } else if (res && res.status === 'error') {
                notification.error({
                    message: res.message,
                    duration: 2,
                    showProgress: true
                });
                setIsLoadingFaucet(false);
                setIsDoneFaucet(false);
            }
        } catch (error) {
            notification.error({
                message: res.message,
                duration: 2,
                showProgress: true
            });
            setIsLoadingFaucet(false);
            setIsDoneFaucet(false);
        } finally {
            setIsLoadingFaucet(false);
        }
    };

    useEffect(() => {
        if (!(address as `0x${string}`)) {
            if (isMobile) return;
            disconnect();
            logoutWalletAction();
            logoutTelegramAction();
            logoutDiscordAction();
            logoutTwitterAction();
        }
    }, [address]);

    // };

    useEffect(() => {
        // eslint-disable-next-line
        (async () => {
            if (
                authState.statusLoginTele == EActionStatus.Succeeded &&
                authState.userTele
            ) {
                await openNotification({
                    message: t('LOGIN_TELE_SUCCESSFULLY'),
                    placement: 'topRight',
                    type: 'success'
                });

                await new Promise((resolve) => setTimeout(resolve, 1000));
                resetStatusLoginTeleAction();
            }

            if (authState.statusLoginWallet === EActionStatus.Failed) {
                if (authState.errorMessage) {
                    await openNotification({
                        message: authState.errorMessage,
                        placement: 'topRight',
                        type: 'error'
                    });
                }
                logoutTelegramAction();
            }
        })();
        // eslint-disable-next-line
    }, [authState.statusLoginWallet]);

    return (
        <div className="">
            {contextHolder}

            <Row gutter={[1, 5]}>
                <Col
                    xs={24}
                    sm={24}
                    lg={24}
                    md={24}
                    xxl={24}
                >
                    <Title
                        level={4}
                        className={` ${isMobile ? 'text-center text-3xl' : ''} !font-forza text-4xl`}
                    >
                        {' '}
                        {t('TITLE_FAUCET')}
                    </Title>
                </Col>
                <Col
                    xs={24}
                    sm={24}
                    lg={24}
                    md={24}
                    xxl={24}
                >
                    <div
                        className={`flex ${isMobile ? ' justify-center' : ''} items-center `}
                    >
                        <Title
                            level={5}
                            className={`  mr-[6px] font-forza text-xl`}
                        >
                            {' '}
                            {t('DESC_FAUCET')} {chainConfig?.currency}
                        </Title>
                    </div>
                </Col>
                <Col
                    xs={24}
                    sm={24}
                    lg={24}
                    md={24}
                    xxl={24}
                >
                    <div className="mb-0">
                        <div className="flex flex-col gap-1">
                            <span className="!font-forza text-base ">
                                {t('REQUIRE_FAUCET_PREFIX')}{' '}
                                <strong>{'0.0005 ETH'}</strong>{' '}
                                {t('REQUIRE_FAUCET_SUBFIX')}
                            </span>
                        </div>
                    </div>
                </Col>

                <Col
                    xs={24}
                    sm={24}
                    lg={24}
                    md={24}
                    xxl={24}
                >
                    <div className="flex flex-col gap-2">
                        <span className="relative w-fit !flex-1 text-nowrap !font-forza text-base">
                            <span className="absolute left-[-15px] top-1/2 h-2 w-2 -translate-y-1/2 transform rounded-full bg-black"></span>
                            {t('DESC_STEP1')}{' '}
                            <CheckCircleFilled
                                className={`${isClickFollow ? 'text-green' : 'text-gray-400'} `}
                            />
                        </span>
                        <Button
                            type="default"
                            className={` !mt-2 w-full  !font-forza text-white transition-opacity hover:bg-[#1565C0]`}
                            size="large"
                            style={{
                                backgroundColor: '#297fd6',
                                color: 'white',
                                opacity: !(address as `0x${string}`) ? 0.6 : 1,
                                whiteSpace: 'normal',
                                wordWrap: 'break-word',
                                cursor: validateInput.walletAddress.error
                                    ? 'not-allowed'
                                    : 'pointer'
                            }}
                            disabled={!(address as `0x${string}`)}
                            onClick={handleClickFollowRocketLaunch}
                        >
                            {t('FOLLOW_ROCKET_LAUNCH')}
                        </Button>
                    </div>
                </Col>
                {/* verify your telegram */}
                <Col
                    xs={24}
                    sm={24}
                    lg={24}
                    md={24}
                    xxl={24}
                >
                    <div className="flex flex-col gap-2">
                        <span className="relative w-fit !flex-1 text-nowrap !font-forza text-base">
                            <span className="absolute left-[-15px] top-1/2 h-2 w-2 -translate-y-1/2 transform rounded-full bg-black"></span>
                            {t('DESC_STEP2')}{' '}
                            <CheckCircleFilled
                                className={`
                                ${isClickFollow && (address as `0x${string}`) && authState.userTele ? 'text-green' : 'text-gray-400'}
                                `}
                            />
                        </span>
                        <span className="mt-[-6px] !font-forza text-xs">
                            {t('PRE_SUB_DESC_STEP2')}{' '}
                            <strong>{chainConfig?.currency}</strong>{' '}
                            {t('SUB_SUB_DESC_STEP2')}{' '}
                        </span>
                        {(address as `0x${string}`) && authState.userTele && (
                            <Text className="rounded-xl bg-[#297fd6] px-3 py-[5px] text-center !font-forza text-base text-white ">
                                {authState.userTele.auth.username}
                            </Text>
                        )}
                    </div>
                </Col>

                {/* step 3 */}
                <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xxl={24}
                >
                    <div className="flex flex-col gap-2">
                        <span className="relative w-fit !flex-1 text-nowrap !font-forza text-base">
                            <span className="absolute left-[-15px] top-1/2 h-2 w-2 -translate-y-1/2 transform rounded-full bg-black"></span>
                            {t('DESC_STEP3')} {chainConfig?.currency}{' '}
                            <CheckCircleFilled
                                className={`
                                ${isDoneFaucet ? 'text-green' : 'text-gray-400'}
                                `}
                            />
                        </span>
                        <Input
                            size="large"
                            className="!font-forza text-base"
                            placeholder="Ex: 0x0B6Be60f70d3c13D62Fb7816A0a57ba0db78C800"
                            onChange={onChange}
                            name="walletAddress"
                            value={walletAddress}
                            allowClear
                        />
                        {validateInput.walletAddress.error === true && (
                            <Text className="font-forza text-lg text-red-500">
                                {validateInput.walletAddress.helperText}
                            </Text>
                        )}
                    </div>
                </Col>

                <Col
                    xs={24}
                    sm={24}
                    lg={24}
                    md={24}
                    xxl={24}
                >
                    <Spin
                        delay={0}
                        spinning={isLoadingFaucet}
                    >
                        <div className="">
                            <Button
                                type="default"
                                className={` !mt-2 mb-1 w-full !font-forza text-white transition-opacity ${isClickFollow && (address as `0x${string}`) && isUserInfoSavedWithTelegram ? 'hover:bg-[#1565C0]' : ''}`}
                                style={{
                                    backgroundColor: '#297fd6',
                                    color: 'white',
                                    opacity:
                                        !(address as `0x${string}`) ||
                                        isLoadingFaucet === true ||
                                        validateInput.walletAddress.error ===
                                            true ||
                                        !isClickFollow ||
                                        !walletAddress ||
                                        !isUserInfoSavedWithTelegram
                                            ? 0.6
                                            : 1,
                                    whiteSpace: 'normal',
                                    wordWrap: 'break-word',
                                    cursor:
                                        !(address as `0x${string}`) ||
                                        isLoadingFaucet === true ||
                                        validateInput.walletAddress.error ===
                                            true ||
                                        !isClickFollow ||
                                        !walletAddress ||
                                        !isUserInfoSavedWithTelegram
                                            ? 'not-allowed'
                                            : 'pointer'
                                }}
                                disabled={
                                    !(address as `0x${string}`) ||
                                    !isClickFollow ||
                                    validateInput.walletAddress.error ===
                                        true ||
                                    !walletAddress ||
                                    !isUserInfoSavedWithTelegram
                                }
                                size="large"
                                onClick={handleSubmitFaucet}
                            >
                                {t('DRIP_TOKEN')}
                            </Button>
                            {isDoneFaucet && (
                                <span className="animate-fadeIn !font-forza text-sm text-[#00C805]">
                                    {t('SUCCESS_FAUCET')}{' '}
                                    {t('FRE_SUB_SUCCESS_FAUCET')}{' '}
                                    <strong>{chainConfig?.currency}</strong>{' '}
                                    {t('SUB_SUB_SUCCESS_FAUCET')}{' '}
                                    <span
                                        className="cursor-pointer  rounded-sm border border-black bg-white text-xs text-black hover:bg-[black] hover:text-white"
                                        onClick={handleClickCreateRocketLaunch}
                                    >
                                        {t('CREATE_NEW_TOKEN')}
                                    </span>
                                </span>
                            )}
                        </div>
                    </Spin>
                </Col>

                <Col
                    xs={24}
                    sm={24}
                    lg={24}
                    md={24}
                    xxl={24}
                    className="mt-2"
                >
                    <div className="flex flex-col gap-1">
                        <div className="mb-1 w-full border-t-2 border-[#BB3E4E]"></div>
                        <span className="mt-2 w-full !font-forza text-base">
                            {t('TIME_REMIND_FAUCET')}
                        </span>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default FaucetInformation;
