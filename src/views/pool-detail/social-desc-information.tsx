/* eslint-disable */
import { randomDefaultPoolImage } from '@/src/common/utils/utils';
import { usePoolDetail } from '@/src/stores/pool/hook';
const SocialDescInformation = () => {
    const [{ poolStateDetail }] = usePoolDetail();
    const { metaDataInfo } = poolStateDetail;

    const openInNewTab = (url: any | null) => {
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

    return (
        <div className="flex flex-col gap-1 bg-white">
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
                    className="rounded-full"
                />
                {finalTwitterUrl && (
                    <img
                        src={'/icon/twitter.svg'}
                        alt={'twitter'}
                        width={40}
                        height={40}
                        style={{ cursor: 'pointer' }}
                        onClick={() => openInNewTab(finalTwitterUrl)}
                    />
                )}

                {finalTelegramUrl && (
                    <img
                        src={'/icon/telegram.svg'}
                        alt={'telegram'}
                        style={{ cursor: 'pointer' }}
                        width={40}
                        height={40}
                        onClick={() => openInNewTab(finalTelegramUrl)}
                    />
                )}
                {finalWebsiteUrl && (
                    <img
                        src={'/icon/web.svg'}
                        style={{ cursor: 'pointer' }}
                        alt={'website'}
                        width={40}
                        height={40}
                        onClick={() => openInNewTab(finalWebsiteUrl)}
                    />
                )}
                {finalDiscordUrl && (
                    <img
                        src={'/icon/discord.svg'}
                        style={{ cursor: 'pointer' }}
                        alt={'discord'}
                        width={40}
                        height={40}
                        onClick={() => openInNewTab(finalDiscordUrl)}
                    />
                )}
            </div>

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
        </div>
    );
};
export default SocialDescInformation;
