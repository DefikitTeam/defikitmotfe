import { shortWalletAddress } from '@/src/common/utils/utils';
import { usePoolDetail } from '@/src/stores/pool/hook';
import { IHolderDistribution } from '@/src/stores/pool/type';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';

const HolderDistribution = () => {
    const t = useTranslations();

    const [{ poolStateDetail }, , , , , setPageHolderDistributionAction] =
        usePoolDetail();

    const { holderDistribution, pool } = poolStateDetail;
    const columns: ColumnsType<IHolderDistribution> = [
        {
            title: t('HOLDER_DISTRIBUTION'),
            dataIndex: 'user',
            width: '5%',
            className: '!font-forza',
            align: 'center',
            render: (_, record) => (
                <span className="text-black">
                    {shortWalletAddress(record.user || '')}
                </span>
            )
        },

        {
            title: t('PERCENTAGE'),
            dataIndex: 'batch',
            width: '5%',
            className: '!font-forza',
            align: 'center',
            render: (_, record) => {
                const percentage =
                    (Number(record.batch) / Number(pool?.totalBatch)) * 100;
                return (
                    <div className=" text-black">
                        {percentage.toFixed(2)}%
                        {record.isCreator && (
                            <span className="ml-2 font-bold">(creator)</span>
                        )}
                        {record.isPool && (
                            <span className="ml-2 font-bold">
                                (bonding curve)
                            </span>
                        )}
                    </div>
                );
            }
        }
    ];
    const handlePageHolderDistributionChange = (
        pageHolderDistribution: number
    ) => {
        setPageHolderDistributionAction(pageHolderDistribution);
    };

    return (
        <div className="h-full w-full bg-white pt-2">
            {/* <div className="!font-forza text-base font-bold">
                {t('HOLDER_DISTRIBUTION')}
            </div> */}

            <Table
                rowKey="id"
                dataSource={holderDistribution}
                columns={columns}
                className="!font-forza"
                // pagination={{ pageSize: 10 }}
                scroll={{ x: 300 }}
                bordered
                sortDirections={['descend']}
                pagination={{
                    pageSize: poolStateDetail.limitHolderDistribution,
                    defaultCurrent: poolStateDetail.pageHolderDistribution,
                    total: poolStateDetail.totalHolderDistribution,
                    onChange: handlePageHolderDistributionChange,
                    showSizeChanger: false
                }}
            />
        </div>
    );
};

export default HolderDistribution;
