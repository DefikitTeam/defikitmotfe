/* eslint-disable */
import { randomDefaultPoolImage } from '@/src/common/utils/utils';
import { usePoolDetail } from '@/src/stores/pool/hook';
import { useState } from 'react';
import ModalSocialScore from './modal-social-score';
import Image from 'next/image';
import { notification } from 'antd';
import { useAccount } from 'wagmi';
const SocialDescInformation = () => {
    const [{ poolStateDetail }, , , , , , , setOpenModalSocialScoreAction] =
        usePoolDetail();
    const { metaDataInfo, socialScoreInfo } = poolStateDetail;

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
    const { isConnected, address } = useAccount();

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

    return (
        <div className="relative flex flex-col gap-1 bg-white">
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
                    <Image
                        src="/icon/twitter.svg"
                        alt="twitter"
                        width={40}
                        height={40}
                        style={{ cursor: 'pointer' }}
                        onClick={() => openInNewTab(finalTwitterUrl)}
                    />
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
            <ModalSocialScore />
        </div>
    );
};
export default SocialDescInformation;
