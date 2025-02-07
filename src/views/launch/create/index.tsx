/* eslint-disable */
'use client';
import { NEXT_PUBLIC_API_ENDPOINT } from '@/src/common/web3/constants/env';
import BoxArea from '@/src/components/common/box-area';
import useCurrentChainInformation from '@/src/hooks/useCurrentChainInformation';
import { useMultiCaller } from '@/src/hooks/useMultiCaller';
import useWindowSize from '@/src/hooks/useWindowSize';
import serviceUpload from '@/src/services/external-services/backend-server/upload';
import {
    useCreatePoolLaunchInformation,
    usePassData
} from '@/src/stores/pool/hook';
import { useListTokenOwner } from '@/src/stores/token/hook';
import { Col, Form, notification, Row, Typography } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useForm } from 'antd/lib/form/Form';
import { AxiosError } from 'axios';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAccount } from 'wagmi';
import CreateToken from './create-token';
import PoolInformation from './pool-information';
import SaveCreatePoolButton from './save-button';
import { TOKEN_STATUS } from '@/src/common/constant/token';
import servicePool from '@/src/services/external-services/backend-server/pool';

const { Title } = Typography;

export interface IPoolCreatForm {}

const CreateLaunch = () => {
    const { isMobile } = useWindowSize();
    const t = useTranslations();
    const [form] = useForm<IPoolCreatForm>();
    const [isLoadingCreateLaunch, setIsLoadingCreateLaunch] = useState(false);

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
    const router = useRouter();

    const { address, addresses } = useAccount();
    const { chainData } = useCurrentChainInformation();
    const [data, , resetData] = useCreatePoolLaunchInformation();
    const { useCreateLaunchPool } = useMultiCaller();

    const getFileAvatar = (value: {
        file: string | Blob | RcFile | File;
        flag: boolean;
    }) => {
        setAvatarInfo(value);
    };

    useEffect(() => {
        if (useCreateLaunchPool.isLoadingInitCreateLaunchPool) {
            notification.info({
                message: 'Pool in Progress',
                description: 'Please wait while your pool is being processed',
                duration: 1.3,
                showProgress: true
            });
        }
    }, [useCreateLaunchPool.isLoadingInitCreateLaunchPool]);

    useEffect(() => {
        if (useCreateLaunchPool.isLoadingAgreedCreateLaunchPool) {
            setIsLoadingCreateLaunch(true);
            notification.info({
                message: 'Active pool is processing',

                duration: 1.2,
                showProgress: true
            });
        }
    }, [useCreateLaunchPool.isLoadingAgreedCreateLaunchPool]);

    useEffect(() => {
        if (useCreateLaunchPool.isConfirmed) {
            setIsLoadingCreateLaunch(false);
            notification.success({
                message: 'Active pool successfully!',
                duration: 1.2,
                showProgress: true
            });
            resetData();
            resetPassData();
            setCurrentChoicedToken({
                id: '',
                owner: '',
                name: '',
                symbol: '',
                decimals: '',
                totalSupply: '',
                status: ''
            });

            setTimeout(() => {
                getListTokenByOwner({
                    ownerAddress: address as `0x${string}`,
                    chainId: chainData.chainId as number,
                    status: TOKEN_STATUS.INACTIVE
                });
            }, 2000);
            setTimeout(() => {
                router.push('/');
            }, 1000);
        }
    }, [useCreateLaunchPool.isConfirmed]);

    useEffect(() => {
        if (useCreateLaunchPool.isError) {
            setIsLoadingCreateLaunch(false);
            notification.error({
                message: 'Transaction Failed',
                duration: 3,
                showProgress: true
            });
        }
    }, [useCreateLaunchPool.isError]);
    const onFinish = async () => {
        let urlAvatar: string = '';
        setIsLoadingCreateLaunch(true);
        try {
            if (avatarInfo?.flag) {
                const res = await serviceUpload.getPresignedUrlAvatar(
                    avatarInfo?.file as File,
                    data.token,
                    chainData.chainId.toString()
                );
                urlAvatar = res;
            }
            const metadata = {
                image: urlAvatar,
                description: data.description,
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
            const resData = await serviceUpload.uploadMetadataToServer(
                metadataPayload,
                chainData.chainId.toString(),
                data.token
            );
            let metaDataLink: string = '';
            if (resData && resData.status === 'success') {
                metaDataLink = `${NEXT_PUBLIC_API_ENDPOINT}/c/${chainData.chainId}/t/${data.token}/metadata`;
            }

            // call sc to active pool
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
            await servicePool.createLaunchPool(
                settingTokenState.choicedToken.name,
                settingTokenState.choicedToken.symbol,
                settingTokenState.choicedToken.decimals,
                settingTokenState.choicedToken.totalSupply,

                settingTokenState.choicedToken.id,
                chainData.chainId.toString()
            );
            await useCreateLaunchPool.actionAsync({
                token: data.token,
                fixedCapETH: new BigNumber(data.fixedCapETH)
                    .times(1e18)
                    .toFixed(0),
                tokenForAirdrop: new BigNumber(data.tokenForAirdrop)
                    // .times(
                    //     10 ** Number(settingTokenState.choicedToken.decimals)
                    // )
                    .toFixed(0),
                tokenForFarm: new BigNumber(data.tokenForFarm)
                    // .times(
                    //     10 ** Number(settingTokenState.choicedToken.decimals)
                    // )
                    .toFixed(0),
                tokenForSale: new BigNumber(data.tokenToMint)
                    // .times(
                    //     10 ** Number(settingTokenState.choicedToken.decimals)
                    // )
                    .toFixed(0),
                tokenForAddLP: new BigNumber(data.tokenForAddLP)
                    // .times(
                    //     10 ** Number(settingTokenState.choicedToken.decimals)
                    // )
                    .toFixed(0),
                tokenPerPurchase: new BigNumber(data.tokenToMint)
                    // .times(
                    //     10 ** Number(settingTokenState.choicedToken.decimals)
                    // )
                    .div(data.totalBatch)
                    .toFixed(0),
                maxRepeatPurchase: new BigNumber(data.maxRepeatPurdchase)
                    // .times(
                    //     10 ** Number(settingTokenState.choicedToken.decimals)
                    // )
                    .toFixed(0),
                startTime: data.startTime,
                minDurationSell: data.minDurationSell * 3600,
                maxDurationSell: maxDurationSell,
                metadata: metaDataLink
            });
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

                    <Col
                        xs={24}
                        sm={24}
                        lg={24}
                        md={24}
                        xxl={24}
                    >
                        <CreateToken />
                    </Col>
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
                        />
                        <SaveCreatePoolButton
                            isLoading={isLoadingCreateLaunch}
                            disiabled={
                                isLoadingCreateLaunch ||
                                !address ||
                                data.token === '' ||
                                !avatarInfo?.flag
                            }
                        />
                    </Form>
                </Col>
            </div>
        </BoxArea>
    );
};

export default CreateLaunch;
