/* eslint-disable */
import { randomDefaultPoolImage } from '@/src/common/utils/utils';
import { usePoolDetail } from '@/src/stores/pool/hook';
import { useState } from 'react';
import ModalSocialScore from './modal-social-score';
import Image from 'next/image';
import { notification, Modal, Form, Input, Button, Tooltip } from 'antd';
import { useAccount, useSignMessage } from 'wagmi';
import { useTranslations } from 'next-intl';
import {
    REGEX_DISCORD,
    REGEX_TELEGRAM,
    REGEX_TWITTER,
    REGEX_WEBSITE
} from '@/src/common/constant/constance';
import serviceUpload from '@/src/services/external-services/backend-server/upload';
import { useParams } from 'next/navigation';
import { useConfig } from '@/src/hooks/useConfig';

const SocialDescInformation = () => {
    const [
        { poolStateDetail },
        fetchPoolDetail,
        ,
        ,
        ,
        ,
        ,
        setOpenModalSocialScoreAction
    ] = usePoolDetail();

    const { metaDataInfo, socialScoreInfo } = poolStateDetail;
    const { isConnected, address } = useAccount();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations();
    const { chainConfig } = useConfig();
    const params = useParams();
    const poolAddress = params?.poolAddress as string;
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

    const openInNewTab = (url: any | null) => {
        if (!isConnected || !address) {
            notification.error({
                message: 'Error',
                description: 'Please connect to your wallet',
                duration: 3,
                showProgress: true
            });
            return;
        }

        if (typeof url === 'object') {
            window.open(url.value, '_blank', 'noopener,noreferrer');
        } else {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };
    const image: any =
        metaDataInfo && metaDataInfo?.image
            ? metaDataInfo?.image
            : randomDefaultPoolImage();

    let finalImageUrl: string;
    if (typeof image === 'object') {
        finalImageUrl = image.value;
    } else {
        finalImageUrl = image;
    }

    const twitter: any = metaDataInfo?.twitter;

    let finalTwitterUrl: string;
    if (twitter && typeof twitter === 'object') {
        finalTwitterUrl = twitter.value || '';
    } else {
        finalTwitterUrl = twitter;
    }

    const telegram: any = metaDataInfo?.telegram;
    let finalTelegramUrl: string;
    if (telegram && typeof telegram === 'object') {
        finalTelegramUrl = telegram.value || '';
    } else {
        finalTelegramUrl = telegram;
    }

    const discord: any = metaDataInfo?.discord;
    let finalDiscordUrl: string;
    if (discord && typeof discord === 'object') {
        finalDiscordUrl = discord.value || '';
    } else {
        finalDiscordUrl = discord;
    }

    const website: any = metaDataInfo?.website;
    let finalWebsiteUrl: string;
    if (website && typeof website === 'object') {
        finalWebsiteUrl = website.value || '';
    } else {
        finalWebsiteUrl = website;
    }

    const handleClickShowSocialScore = () => {
        if (!isConnected || !address) {
            notification.error({
                message: 'Error',
                description: 'Please connect to your wallet',
                duration: 3,
                showProgress: true
            });
            return;
        }

        setOpenModalSocialScoreAction(true);
    };

    const [showImagePreview, setShowImagePreview] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState('');

    const handleImageClick = (imageUrl: string) => {
        if (!isConnected || !address) {
            notification.error({
                message: 'Error',
                description: 'Please connect to your wallet',
                duration: 3,
                showProgress: true
            });
            return;
        }

        setPreviewImageUrl(imageUrl);
        setShowImagePreview(true);
    };

    const handleUpdateSocials = async (values: any) => {
        if (!isConnected || !address) {
            notification.error({
                message: 'Error',
                description: 'Please connect to your wallet',
                duration: 3,
                showProgress: true
            });
            return;
        }

        setIsLoading(true);

        try {
            // Preserve all existing metadata fields

            const metadata = {
                ...metaDataInfo,
                image: finalImageUrl,
                description:
                    typeof metaDataInfo?.description === 'object'
                        ? metaDataInfo?.description?.value
                        : metaDataInfo?.description,
                website:
                    values.websiteLink &&
                        !values.websiteLink.startsWith('https://')
                        ? `https://${values.websiteLink}`
                        : values.websiteLink,
                telegram:
                    values.telegramLink &&
                        !values.telegramLink.startsWith('https://')
                        ? `https://${values.telegramLink}`
                        : values.telegramLink,
                twitter:
                    values.twitterLink &&
                        !values.twitterLink.startsWith('https://')
                        ? `https://${values.twitterLink}`
                        : values.twitterLink,
                discord:
                    values.discordLink &&
                        !values.discordLink.startsWith('https://')
                        ? `https://${values.discordLink}`
                        : values.discordLink
            };

            const metadataPayload = JSON.stringify(metadata);

            const message = address as `0x${string}`;
            const signature = await signMessageAsync({
                message: message
            });

            const resData = await serviceUpload.uploadMetadataToServer(
                metadataPayload,
                chainConfig?.chainId.toString()!,
                poolAddress,
                address,
                signature,
                message
            );

            if (resData && resData.status === 'success') {
                notification.success({
                    message: 'Success',
                    description: 'Social links updated successfully',
                    duration: 3,
                    showProgress: true
                });
                setIsModalOpen(false);
                setIsLoading(false);
            }

            fetchPoolDetail({
                page: poolStateDetail.pageTransaction,
                limit: poolStateDetail.limitTransaction,
                poolAddress: poolAddress,
                chainId: chainConfig?.chainId as number
            });
        } catch (error) {
            console.error('Error updating social links:', error);
            notification.error({
                message: 'Error',
                description: 'Failed to update social links',
                duration: 3,
                showProgress: true
            });
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col gap-4  bg-white">
            <div className="flex h-full space-x-2">
                <img
                    src={
                        !finalImageUrl
                            ? randomDefaultPoolImage()
                            : finalImageUrl
                    }
                    alt={'Token image'}
                    width={45}
                    height={45}
                    className="cursor-pointer rounded-full"
                    onClick={() =>
                        handleImageClick(
                            !finalImageUrl
                                ? randomDefaultPoolImage()
                                : finalImageUrl
                        )
                    }
                />

                {/* <Image
                    src={
                        !finalImageUrl
                            ? randomDefaultPoolImage()
                            : finalImageUrl
                    }
                    alt="Token image"
                    width={45}
                    height={45}
                    className="cursor-pointer rounded-full"
                    onClick={() =>
                        handleImageClick(
                            !finalImageUrl
                                ? randomDefaultPoolImage()
                                : finalImageUrl
                        )
                    }
                /> */}

                {finalTwitterUrl && (
                    <Tooltip
                        title={
                            <div className="!font-forza">
                                <p>Click to open Twitter</p>
                                <p className="text-yellow-300">Task: Post about your token with keyword {poolAddress}</p>
                            </div>
                        }
                        overlayClassName="!font-forza"
                    >
                        <Image
                            src="/icon/twitter.svg"
                            alt="twitter"
                            width={40}
                            height={40}
                            style={{ cursor: 'pointer' }}
                            onClick={() => openInNewTab(finalTwitterUrl)}
                        />
                    </Tooltip>
                )}

                {!finalTwitterUrl && isConnected && address && (address.toLowerCase() === poolStateDetail.pool?.owner?.toLowerCase()) && (
                    <Tooltip
                        title={
                            <div className="!font-forza">
                                <p className="text-yellow-300">Task: Complete metadata by adding Twitter link</p>
                            </div>
                        }
                        overlayClassName="!font-forza"
                    >
                        <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full border-2 border-dashed border-gray-400">
                            <Image
                                src="/icon/twitter.svg"
                                alt="twitter"
                                width={30}
                                height={30}
                                style={{ opacity: 0.5, cursor: 'pointer' }}
                                onClick={() => setIsModalOpen(true)}
                            />
                        </div>
                    </Tooltip>
                )}

                {finalTelegramUrl && (
                    <Image
                        src="/icon/telegram.svg"
                        alt="telegram"
                        width={40}
                        height={40}
                        style={{ cursor: 'pointer' }}
                        onClick={() => openInNewTab(finalTelegramUrl)}
                    />
                )}

                {!finalTelegramUrl && isConnected && address && (address.toLowerCase() === poolStateDetail.pool?.owner?.toLowerCase()) && (
                    <Tooltip
                        title={
                            <div className="!font-forza">
                                <p className="text-yellow-300">Task: Complete metadata by adding Telegram group</p>
                            </div>
                        }
                        overlayClassName="!font-forza"
                    >
                        <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full border-2 border-dashed border-gray-400">
                            <Image
                                src="/icon/telegram.svg"
                                alt="telegram"
                                width={30}
                                height={30}
                                style={{ opacity: 0.5, cursor: 'pointer' }}
                                onClick={() => setIsModalOpen(true)}
                            />
                        </div>
                    </Tooltip>
                )}

                {finalWebsiteUrl && (
                    <Image
                        src="/icon/web.svg"
                        alt="website"
                        width={40}
                        height={40}
                        style={{ cursor: 'pointer' }}
                        onClick={() => openInNewTab(finalWebsiteUrl)}
                    />
                )}

                {!finalWebsiteUrl && isConnected && address && (address.toLowerCase() === poolStateDetail.pool?.owner?.toLowerCase()) && (
                    <Tooltip
                        title={
                            <div className="!font-forza">
                                <p className="text-yellow-300">Task: Complete metadata by adding Website link</p>
                            </div>
                        }
                        overlayClassName="!font-forza"
                    >
                        <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full border-2 border-dashed border-gray-400">
                            <Image
                                src="/icon/web.svg"
                                alt="website"
                                width={30}
                                height={30}
                                style={{ opacity: 0.5, cursor: 'pointer' }}
                                onClick={() => setIsModalOpen(true)}
                            />
                        </div>
                    </Tooltip>
                )}

                {finalDiscordUrl && (
                    <Image
                        src="/icon/discord.svg"
                        alt="discord"
                        width={40}
                        height={40}
                        style={{ cursor: 'pointer' }}
                        onClick={() => openInNewTab(finalDiscordUrl)}
                    />
                )}

                {!finalDiscordUrl && isConnected && address && (address.toLowerCase() === poolStateDetail.pool?.owner?.toLowerCase()) && (
                    <Tooltip
                        title={
                            <div className="!font-forza">
                                <p className="text-yellow-300">Task: Complete metadata by adding Discord server</p>
                            </div>
                        }
                        overlayClassName="!font-forza"
                    >
                        <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full border-2 border-dashed border-gray-400">
                            <Image
                                src="/icon/discord.svg"
                                alt="discord"
                                width={30}
                                height={30}
                                style={{ opacity: 0.5, cursor: 'pointer' }}
                                onClick={() => setIsModalOpen(true)}
                            />
                        </div>
                    </Tooltip>
                )}

                {isConnected &&
                    address &&
                    address.toLowerCase() ===
                    poolStateDetail.pool?.owner?.toLowerCase() && (
                        <Tooltip
                            title="Update social media links"
                            overlayClassName="!font-forza"
                        >
                            <Button
                                type="primary"
                                loading={isLoading}
                                className="bg-green-500 hover:bg-green-600 flex h-[40px] w-[40px] items-center justify-center rounded-full shadow-lg"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            </Button>
                        </Tooltip>
                    )}

                {/* Add AI Agent tooltip */}
                {isConnected && address && (address.toLowerCase() === poolStateDetail.pool?.owner?.toLowerCase()) && poolStateDetail.dataDetailPoolFromServer?.aiAgentId && (
                    <Tooltip
                        title={
                            <div className="!font-forza">
                                <p className="text-yellow-300">Task: Create AI Agent for your token</p>
                            </div>
                        }
                        overlayClassName="!font-forza"
                    >
                        <div
                            className="flex h-[40px] w-[40px] items-center justify-center rounded-full border-2 border-dashed border-gray-400 cursor-pointer"
                            onClick={() => {
                                // Handle AI Agent creation - you can add navigation or modal here
                                notification.info({
                                    message: 'AI Agent Creation',
                                    description: 'Please create an AI Agent to enhance your token capabilities',
                                    duration: 3,
                                    showProgress: true
                                });
                            }}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="gray"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                                <path d="M12 2a10 10 0 1 1-10 10h10V2z" />
                                <path d="M12 12 9 9" />
                                <path d="m12 12 3-3" />
                            </svg>
                        </div>
                    </Tooltip>
                )}

                <div
                    className="flex h-[40px] w-[40px] animate-pulse cursor-pointer items-center justify-center 
                    rounded-full bg-blue-500 shadow-lg"
                    onClick={handleClickShowSocialScore}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-[ping_2s_ease-in-out_infinite]"
                    >
                        <rect
                            x="2"
                            y="12"
                            width="4"
                            height="8"
                        />
                        <rect
                            x="10"
                            y="8"
                            width="4"
                            height="12"
                        />
                        <rect
                            x="18"
                            y="4"
                            width="4"
                            height="16"
                        />
                    </svg>
                </div>
            </div>

            {showImagePreview && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/75"
                    onClick={() => setShowImagePreview(false)}
                >
                    <div
                        className="relative rounded-lg p-3"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={previewImageUrl}
                            alt="Preview"
                            className="h-[250px] w-[250px] rounded-md object-contain ring-2"
                        />
                        <button
                            className="absolute right-1 top-1 rounded-full bg-white p-1 transition-colors hover:bg-gray-100 "
                            onClick={() => setShowImagePreview(false)}
                            style={{ transform: 'translate(50%, -50%)' }}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="black"
                                strokeWidth="2"
                            >
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="pt-2">
                <h3 className="!font-forza text-base font-bold">
                    Description:
                </h3>
                <span className="!font-forza text-base">
                    {typeof metaDataInfo?.description === 'object'
                        ? metaDataInfo?.description?.value
                        : metaDataInfo?.description}
                </span>
            </div>

            <Modal
                title={
                    <span className="!font-forza text-lg">
                        Update Social Links
                    </span>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateSocials}
                    initialValues={{
                        websiteLink: finalWebsiteUrl,
                        telegramLink: finalTelegramUrl,
                        twitterLink: finalTwitterUrl,
                        discordLink: finalDiscordUrl
                    }}
                >
                    <Form.Item
                        name="websiteLink"
                        label={<span className="!font-forza">Website</span>}
                        rules={[
                            {
                                pattern: REGEX_WEBSITE,
                                message: 'Please enter a valid website URL'
                            }
                        ]}
                    >
                        <Input placeholder="https://example.com" />
                    </Form.Item>

                    <Form.Item
                        name="telegramLink"
                        label={<span className="!font-forza">Telegram</span>}
                        rules={[
                            {
                                pattern: REGEX_TELEGRAM,
                                message: 'Please enter a valid Telegram URL'
                            }
                        ]}
                    >
                        <Input placeholder="https://t.me/your_group" />
                    </Form.Item>

                    <Form.Item
                        name="twitterLink"
                        label={<span className="!font-forza">Twitter</span>}
                        rules={[
                            {
                                pattern: REGEX_TWITTER,
                                message: 'Please enter a valid Twitter URL'
                            }
                        ]}
                    >
                        <Input placeholder="https://twitter.com/username" />
                    </Form.Item>

                    <Form.Item
                        name="discordLink"
                        label={<span className="!font-forza">Discord</span>}
                        rules={[
                            {
                                pattern: REGEX_DISCORD,
                                message: 'Please enter a valid Discord URL'
                            }
                        ]}
                    >
                        <Input placeholder="https://discord.gg/invite" />
                    </Form.Item>

                    <Form.Item className="mb-0 text-right">
                        <Button
                            type="default"
                            onClick={() => setIsModalOpen(false)}
                            className="mr-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <ModalSocialScore />
        </div>
    );
};
export default SocialDescInformation;
