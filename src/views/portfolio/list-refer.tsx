/* eslint-disable */
import { useInviteListReferPortfolio } from '@/src/stores/invite-code/hook';
import { notification } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import ModalListReferPortfolio from './modal-list-refer-portfolio';
import { useEffect } from 'react';

const ListRefer = () => {
    const t = useTranslations();
    const { address, isConnected, chainId } = useAccount();

    const params = useParams();
    const addressParams = params?.walletAddress as string;
    const isAddressDifferent = addressParams && addressParams !== address;

    const [
        { inviteListRefer },
        fetchInviteListRefer,
        setOpenModalInviteListReferAction,
        resetInviteListReferAction
    ] = useInviteListReferPortfolio();

    const { data, isOpenModalInviteListRefer } = inviteListRefer;

    useEffect(() => {
        if (!(address as `0x${string}`) || !chainId || !addressParams) {
            resetInviteListReferAction();
        }
    }, [address, addressParams]);

    const handleClickViewListRefer = () => {
        if (!isConnected || !address) {
            notification.error({
                message: 'Error',
                description: 'Please connect to your wallet',
                duration: 3,
                showProgress: true
            });
            return;
        }
        setOpenModalInviteListReferAction(true);
    };

    return (
        <div className="h-full w-full">
            <div className="">
                <p className="!font-forza text-base font-bold text-black">
                    {t('INVITE_LIST_REFER')}
                    {'('}
                    {data?.length || 0}
                    {') '}
                    {address && (
                        <span
                            className="cursor-pointer rounded-2xl border-2 border-black bg-white px-2 py-1 text-black transition-colors duration-300 hover:bg-black hover:text-white"
                            onClick={handleClickViewListRefer}
                        >
                            {t('VIEW')}{' '}
                        </span>
                    )}
                </p>
            </div>

            <ModalListReferPortfolio />
        </div>
    );
};

export default ListRefer;
