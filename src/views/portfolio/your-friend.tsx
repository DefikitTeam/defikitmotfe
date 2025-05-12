/* eslint-disable */
'use client';
import { usePortfolio } from '@/src/stores/profile/hook';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import ModalYourFriend from './modal-your-friend';
import { notification } from 'antd';

const YourFriend = () => {
    const t = useTranslations();
    const { address, isConnected } = useAccount();
    const params = useParams();
    const addressParams = params?.walletAddress as string;
    const isAddressDifferent = addressParams && addressParams !== address;

    const [
        { portfolio },
        fetchPortfolio,
        setIdCurrentChoosedTokenSell,
        fetchYourListFriendAction,
        setOpenModalYourFriendListAction
    ] = usePortfolio();
    const { yourFriendList, openModalYourFriendList } = portfolio;

    const handleClickViewYourFriend = () => {
        if (!isConnected || !address) {
            notification.error({
                message: 'Error',
                description: 'Please connect to your wallet',
                duration: 3,
                showProgress: true
            });
            return;
        }
        
        setOpenModalYourFriendListAction(true);
    };
    return (
        <div className="h-full w-full">
            <div className="">
                <p className="!font-forza text-base font-bold text-black">
                    {isAddressDifferent ? t('FRIENDS') : t('YOUR_FRIEND')}
                    {'('}
                    {yourFriendList?.length || 0}
                    {') '}
                    {address && (
                        <span
                            className="cursor-pointer rounded-2xl border-2 border-black bg-white px-2 py-1 text-black transition-colors duration-300 hover:bg-black hover:text-white"
                            onClick={handleClickViewYourFriend}
                        >
                            {t('VIEW')}{' '}
                        </span>
                    )}
                </p>
            </div>
            <ModalYourFriend />
        </div>
    );
};

export default YourFriend;
