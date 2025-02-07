/* eslint-disable */

import { shortWalletAddress } from '@/src/common/utils/utils';
import { useInviteListReferPortfolio } from '@/src/stores/invite-code/hook';
import { IInviteReferItem } from '@/src/stores/invite-code/type';
import { Modal, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useAccount } from 'wagmi';

const ModalListReferPortfolio = () => {
    const [
        { inviteListRefer },
        fetchInviteListRefer,
        setOpenModalInviteListReferAction
    ] = useInviteListReferPortfolio();

    const { data, isOpenModalInviteListRefer } = inviteListRefer;

    const t = useTranslations();
    const { address, chain, chainId } = useAccount();

    const handleClose = () => {
        setOpenModalInviteListReferAction(false);
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
        <Modal
            title={
                <span className="!font-forza text-lg font-bold">
                    {t('YOUR_INVITE_LIST_REFER')}
                </span>
            }
            open={isOpenModalInviteListRefer}
            footer={null}
            onCancel={handleClose}
            maskClosable={true}
            centered
        >
            <div className="w-full">
                <Table
                    rowKey="wallet"
                    dataSource={data}
                    // @ts-ignore
                    columns={columns}
                    className="!font-forza"
                    pagination={{ pageSize: 1000 }}
                    scroll={{ x: 200, y: 300 }}
                    bordered
                    sortDirections={['descend']}
                />
            </div>
        </Modal>
    );
};

export default ModalListReferPortfolio;
