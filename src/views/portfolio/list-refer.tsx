/* eslint-disable */
import { shortWalletAddress } from '@/src/common/utils/utils';
import { useInviteListReferPortfolio } from '@/src/stores/invite-code/hook';
import { IInviteReferItem } from '@/src/stores/invite-code/type';
import { notification, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
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

    const columns: ColumnsType<IInviteReferItem> = [
        {
            title: t('INVITED_WALLET'),
            dataIndex: ['UserRef', 'connectedWallet'],
            width: '5%',
            className: '!font-forza',
            align: 'center',
            render: (_, record) => (
                <span className="text-black">
                    {shortWalletAddress(record.UserRef.connectedWallet || '')}
                </span>
            )
        },
        {
            title: t('CODE_REFER'),
            dataIndex: 'code',
            width: '5%',
            className: '!font-forza',
            align: 'center',
            render: (_, record) => (
                <span className="text-black">{record.code || ''}</span>
            )
        }
    ];

    return (
        <div className="h-full w-full">
            {/* <ModalListReferPortfolio /> */}

            <Table
                rowKey="wallet"
                dataSource={data}
                // @ts-ignore
                columns={columns}
                className="!font-forza"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 200, y: 300 }}
                bordered
                sortDirections={['descend']}
            />
        </div>
    );
};

export default ListRefer;
