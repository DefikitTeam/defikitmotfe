/* eslint-disable */
'use client';
import { getContract } from '@/src/common/blockchain/evm/contracts/utils/getContract';
import BoxArea from '@/src/components/common/box-area';
import { useMultiCaller } from '@/src/hooks/useMultiCaller';
import useWindowSize from '@/src/hooks/useWindowSize';
import serviceUpload from '@/src/services/external-services/backend-server/upload';
import {
    useCreatePoolLaunchInformation,
    usePassData
} from '@/src/stores/pool/hook';

import { ADDRESS_NULL, ChainId } from '@/src/common/constant/constance';
import ModalInviteBlocker from '@/src/components/common/invite-blocker';
import { ConfigService } from '@/src/config/services/config-service';
import { useReader } from '@/src/hooks/useReader';
import useRefCodeWatcher from '@/src/hooks/useRefCodeWatcher';
import serviceAuth, {
    REFCODE_INFO_STORAGE_KEY
} from '@/src/services/external-services/backend-server/auth';
import servicePool from '@/src/services/external-services/backend-server/pool';
import { RootState } from '@/src/stores';
import { useAuthLogin } from '@/src/stores/auth/hook';
import { useListTokenOwner } from '@/src/stores/token/hook';
import { Col, Form, notification, Row, Typography } from 'antd';
import { RcFile } from 'antd/es/upload';
import { AxiosError } from 'axios';
import BigNumber from 'bignumber.js';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAccount, useDisconnect } from 'wagmi';
import PoolInformation from './pool-information';
import SaveCreatePoolButton from './save-button';
import { useConfig } from '@/src/hooks/useConfig';
export interface IPoolCreatForm { }
const { Title } = Typography;
// const currentHostName = useCurrentHostNameInformation();
// const isProd =
//     currentHostName.url === NEXT_PUBLIC_DOMAIN_BERACHAIN_MAINNET_PROD;

const config = ConfigService.getInstance();

const CreateLaunch = () => {
    const { isMobile } = useWindowSize();
    const { chainId, address } = useAccount();
    const t = useTranslations();
    // const [form] = useForm<IPoolCreatForm>();
    const [form] = Form.useForm();
    const [isLoadingCreateLaunch, setIsLoadingCreateLaunch] = useState(false);
    const [maxAmountETHResult, setMaxAmountETHResult] = useState<string>('0');
    const { resetPassData } = usePassData();
    const {
        setOpenModdalCreateToken,
        getListTokenByOwner,
        settingTokenState,
        setCurrentChoicedToken
    } = useListTokenOwner();

    const [avatarInfo, setAvatarInfo] = useState<{
        file: string | Blob | RcFile | File;
        flag: boolean;
    }>();

    const [avatarAiGentInfo, setAvatarAiAgentInfo] = useState<{
        file: string | Blob | RcFile | File;
        flag: boolean;
    }>();

    const router = useRouter();

    const chainData = useSelector((state: RootState) => state.chainData);
    const [data, , resetData] = useCreatePoolLaunchInformation();
    const { useLaunchPool } = useMultiCaller();

    const { chainConfig } = useConfig();

    const multiCallerContract = getContract(chainConfig?.chainId!);
    const [signatureMetadata, setSignatureMetadata] = useState<string>('');

    const getFileAvatar = (value: {
        file: string | Blob | RcFile | File;
        flag: boolean;
    }) => {
        setAvatarInfo(value);
    };

    const getFileAiAgentAvatar = (value: {
        file: string | Blob | RcFile | File;
        flag: boolean;
    }) => {
        setAvatarAiAgentInfo(value);
    };

    const { disconnect } = useDisconnect();
    const { authState, setOpenModalInviteBlocker } = useAuthLogin();

    const { value: refCodeExisted, setValue: setRefCodeExisted } = useRefCodeWatcher(REFCODE_INFO_STORAGE_KEY);

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
        if (useLaunchPool.isLoadingInitLaunchPool) {
            notification.info({
                message: 'Pool in Progress',
                description: 'Please wait while your pool is being processed',
                duration: 1.3,
                showProgress: true
            });
        }
    }, [useLaunchPool.isLoadingInitLaunchPool]);

    useEffect(() => {
        if (useLaunchPool.isLoadingAgreedLaunchPool) {
            setIsLoadingCreateLaunch(true);
            notification.info({
                message: 'Active pool is processing',

                duration: 1.2,
                showProgress: true
            });
        }
    }, [useLaunchPool.isLoadingAgreedLaunchPool]);

    useEffect(() => {
        if (useLaunchPool.isConfirmed) {
            const handleConfirmed = async () => {
                const { hash, receipt } = useLaunchPool.data;
                const poolAddress = receipt?.logs[0]?.address!;

                setIsLoadingCreateLaunch(false);

                try {
                    const totalSupplyBefore = new BigNumber(data.totalSupply)
                        .times(new BigNumber(10).pow(data.decimal))
                        .toFixed(0);
                    await Promise.all([
                        await servicePool.createLaunchPool(
                            data.name.trim(),
                            data.symbol.trim(),
                            data.decimal,
                            totalSupplyBefore,
                            poolAddress as `0x${string}`,
                            chainConfig?.chainId.toString()!,
                            data.aiAgent
                        ),
                        await serviceUpload.updateMetadata(
                            chainConfig?.chainId.toString()!,
                            poolAddress as `0x${string}`,
                            signatureMetadata
                        )
                    ]);
                    resetData();
                    resetPassData();
                    setSignatureMetadata('');
                    notification.success({
                        message: 'Active pool successfully!',
                        duration: 3,
                        showProgress: true
                    });

                    setTimeout(() => {
                        router.push(
                            `/${chainConfig?.name.replace(/\s+/g, '').toLowerCase()}/pool/address/${poolAddress.toLowerCase()}`
                        );
                    }, 500);
                } catch (error) {
                    console.error('Error creating launch pool:', error);
                    notification.error({
                        message: 'Failed to create launch pool',
                        duration: 3,
                        showProgress: true
                    });
                }
            };

            handleConfirmed();
        }
    }, [useLaunchPool.isConfirmed]);

    useEffect(() => {
        if (useLaunchPool.isError) {
            setIsLoadingCreateLaunch(false);
            notification.error({
                message: 'Transaction Failed',
                duration: 3,
                showProgress: true
            });
        }
    }, [useLaunchPool.isError]);

    const { dataReader, isFetchingDataReader, reFetchDataReader } = useReader({
        contractAddAndAbi: multiCallerContract,
        poolAddress: undefined,
        userAddress: undefined,
        chainId: chainId as number,
        value: undefined,
        amountOut: Number(data.bondBuyFirst),
        reserveIn: Number(
            new BigNumber(data.fixedCapETH)
                .times(10 ** Number(data.decimal))
                .toFixed(0)
        ),
        reserveOut: Number(
            new BigNumber(
                new BigNumber(data.tokenToMint)
                    .times(10 ** Number(data.decimal))
                    .toFixed(0)
            )
                .div(
                    new BigNumber(data.tokenToMint)
                        .times(10 ** Number(data.decimal))
                        .div(data.totalBatch)
                        .toFixed(0)
                )
                .times(2)
                .toFixed(0)
        )
    });

    const maxAmountETH = dataReader ? dataReader[6] : undefined;

    useEffect(() => {
        if (isFetchingDataReader === false && maxAmountETH) {
            const maxAmountETHFromReader = maxAmountETH?.result;
            if (maxAmountETHFromReader) {
                const maxAmountETHConverted = new BigNumber(
                    maxAmountETHFromReader
                ).toString();
                setMaxAmountETHResult(maxAmountETHConverted);
            }
        }
    }, [isFetchingDataReader, maxAmountETH]);

    const onFinish = async () => {
        let urlAvatar: string = '';
        let urlAiGentAvatar: string = '';
        setIsLoadingCreateLaunch(true);
        try {
            if (avatarInfo?.flag) {
                const res =
                    await serviceUpload.getPresignedUrlAvatarWithoutAddress(
                        avatarInfo?.file as File,
                        chainConfig?.chainId.toString()!
                    );
                urlAvatar = res;
            }
            if (avatarAiGentInfo?.flag) {
                const res =
                    await serviceUpload.getPresignedUrlAvatarWithoutAddress(
                        avatarAiGentInfo?.file as File,
                        chainConfig?.chainId.toString()!
                    );
                urlAiGentAvatar = res;
            }

            let signature: string = '';
            if (urlAvatar) {
                const matches = urlAvatar.match(/\/t\/([^/]+)/);
                signature = matches ? matches[1] : '';
                setSignatureMetadata(signature);
            }
            const metadata = {
                image: urlAvatar,
                imageAiAgent: urlAiGentAvatar,
                description: data.description.trim(),
                website:
                    data.websiteLink && !data.websiteLink.startsWith('https://')
                        ? `https://${data.websiteLink}`
                        : data.websiteLink,
                telegram:
                    data.telegramLink &&
                        !data.telegramLink.startsWith('https://')
                        ? `https://${data.telegramLink}`
                        : data.telegramLink,
                twitter:
                    data.twitterLink && !data.twitterLink.startsWith('https://')
                        ? `https://${data.twitterLink}`
                        : data.twitterLink,
                discord:
                    data.discordLink && !data.discordLink.startsWith('https://')
                        ? `https://${data.discordLink}`
                        : data.discordLink
            };

            const metadataPayload = JSON.stringify(metadata);
            const resData =
                await serviceUpload.uploadMetadataToServerWithoutAddress(
                    metadataPayload,
                    chainConfig?.chainId.toString()!,
                    signature
                );
            let metaDataLink: string = '';
            if (resData && resData.status === 'success') {
                metaDataLink = `${config.getApiConfig().baseUrl}/c/${chainConfig?.chainId}/t/${signature}/metadata`;
            }
            const maxDurationSell =
                new Date(data.endTime).valueOf() -
                new Date(data.startTime).valueOf();

            if (data.minDurationSell * 3600 > maxDurationSell) {
                notification.error({
                    message: t(
                        'THE_MINTING_RELEASE_TIME_CANNOT_BE_GREATER_THAN_THE_END_TIME_OF_THE_POOL'
                    ),
                    duration: 1.3,
                    showProgress: true
                });
                setIsLoadingCreateLaunch(false);
                return;
            }

            if (Number(data.bondBuyFirst) > 0) {
                await useLaunchPool.actionAsync({
                    name: data.name.trim(),
                    symbol: data.symbol.trim(),
                    decimals: data.decimal,
                    totalSupply: new BigNumber(data.totalSupply)
                        .times(10 ** Number(data.decimal))
                        .toFixed(0),
                    fixedCapETH: new BigNumber(data.fixedCapETH)
                        .times(10 ** Number(data.decimal))
                        .toFixed(0),
                    tokenForAirdrop: new BigNumber(data.tokenForAirdrop)
                        .times(10 ** Number(data.decimal))
                        .toFixed(0),
                    tokenForFarm: new BigNumber(data.tokenForFarm)
                        .times(10 ** Number(data.decimal))
                        .toFixed(0),
                    tokenForSale: new BigNumber(data.tokenToMint)
                        .times(10 ** Number(data.decimal))
                        .toFixed(0),
                    tokenForAddLP: new BigNumber(data.tokenForAddLP)
                        .times(10 ** Number(data.decimal))
                        .toFixed(0),
                    tokenPerPurchase: new BigNumber(data.tokenToMint)
                        .times(10 ** Number(data.decimal))
                        .div(data.totalBatch)
                        .toFixed(0),
                    maxRepeatPurchase: new BigNumber(data.maxRepeatPurdchase)
                        .times(10 ** Number(data.decimal))
                        .toFixed(0),
                    startTime: data.startTime,
                    minDurationSell: data.minDurationSell * 3600,
                    maxDurationSell: maxDurationSell,
                    metadata: metaDataLink,
                    numberBatch: data.bondBuyFirst,
                    maxAmountETH: maxAmountETHResult,
                    referrer: authState.userInfo?.referrer
                        ? authState.userInfo?.referrer
                        : ADDRESS_NULL
                });
            } else {
                await useLaunchPool.actionAsync({
                    name: data.name.trim(),
                    symbol: data.symbol.trim(),
                    decimals: data.decimal,
                    totalSupply: new BigNumber(data.totalSupply)
                        .times(10 ** Number(data.decimal))
                        .toFixed(0),
                    fixedCapETH: new BigNumber(data.fixedCapETH)
                        .times(10 ** Number(data.decimal))
                        .toFixed(0),
                    tokenForAirdrop: new BigNumber(data.tokenForAirdrop)
                        .times(10 ** Number(data.decimal))
                        .toFixed(0),
                    tokenForFarm: new BigNumber(data.tokenForFarm)
                        .times(10 ** Number(data.decimal))
                        .toFixed(0),
                    tokenForSale: new BigNumber(data.tokenToMint)
                        .times(10 ** Number(data.decimal))
                        .toFixed(0),
                    tokenForAddLP: new BigNumber(data.tokenForAddLP)
                        .times(10 ** Number(data.decimal))
                        .toFixed(0),
                    tokenPerPurchase: new BigNumber(data.tokenToMint)
                        .times(10 ** Number(data.decimal))
                        .div(data.totalBatch)
                        .toFixed(0),
                    maxRepeatPurchase: new BigNumber(data.maxRepeatPurdchase)
                        .times(10 ** Number(data.decimal))
                        .toFixed(0),
                    startTime: data.startTime,
                    minDurationSell: data.minDurationSell * 3600,
                    maxDurationSell: maxDurationSell,
                    metadata: metaDataLink,
                    numberBatch: '0',
                    maxAmountETH: '0',
                    referrer: authState.userInfo?.referrer
                        ? authState.userInfo?.referrer
                        : ADDRESS_NULL
                });
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({
                    message: t('ERROR'),
                    description: t(error.response?.data.info.message)
                });
                setIsLoadingCreateLaunch(false);
            }
        } finally {
            setIsLoadingCreateLaunch(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <BoxArea>
            <div
                className={`pt-[35px] !font-forza ${isMobile ? '' : 'm-auto w-[60%]'} flex flex-col `}
            >
                <Row gutter={[4, 8]}>
                    <Col
                        xs={24}
                        sm={24}
                        lg={24}
                        md={24}
                        xxl={24}
                    >
                        <Title
                            level={2}
                            className="text-center !font-forza  !text-2xl"
                        >
                            {t('CREATE_LAUNCH')}
                        </Title>
                    </Col>

                    {/* <Col
                        xs={24}
                        sm={24}
                        lg={24}
                        md={24}
                        xxl={24}
                    >
                        <CreateToken />
                    </Col> */}
                </Row>
                <Col
                    xs={24}
                    sm={24}
                    lg={24}
                    md={24}
                    xxl={24}
                >
                    <Form
                        form={form}
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <PoolInformation
                            form={form}
                            getFileAvatar={getFileAvatar}
                            getFileAiAgentAvatar={getFileAiAgentAvatar}
                        />

                        <SaveCreatePoolButton
                            isLoading={isLoadingCreateLaunch}
                            disiabled={
                                isLoadingCreateLaunch ||
                                !address ||
                                !avatarInfo?.flag
                            }
                        />
                    </Form>
                </Col>
            </div>

            <ModalInviteBlocker />
        </BoxArea>
    );
};

export default CreateLaunch;
