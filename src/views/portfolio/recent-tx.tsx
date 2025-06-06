/* eslint-disable */
'use client';
import { ChainId } from '@/src/common/constant/constance';
import { shortWalletAddress } from '@/src/common/utils/utils';
import { useConfig } from '@/src/hooks/useConfig';
import { RootState } from '@/src/stores';
import { usePoolDetail } from '@/src/stores/pool/hooks';
import { Transaction } from '@/src/stores/pool/type';
import { usePortfolio } from '@/src/stores/profile/hook';
import { IRecentTx } from '@/src/stores/profile/type';
import { ExportOutlined } from '@ant-design/icons';
import { notification, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import BigNumber from 'bignumber.js';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Moment from 'react-moment';
import { useSelector } from 'react-redux';
import { useAccount } from 'wagmi';
const { Title } = Typography;

const RecentTx = ({ userWalletAddress }: { userWalletAddress: string }) => {
  const t = useTranslations();
  const params = useParams();
  const [{ portfolio }, , , , , fetchRecentTxAction] = usePortfolio();

  const { recentTx } = portfolio;
  const router = useRouter();
  const { chainConfig } = useConfig();
  const handleOpenResentTx = (hash: string, type: string) => {
    if (hash) {
      window.open(
        chainConfig?.explorer + `/${type}/` + hash,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  const handleClickAddress = (address: string) => {
    router.push(
      `/${chainConfig?.name.replace(/\s+/g, '').toLowerCase()}/profile/address/${address}`
    );
  };

  const columns: ColumnsType<IRecentTx> = [
    {
      title: t('TYPE'),
      dataIndex: 'type',
      width: '10%',
      className: '!font-forza',
      align: 'center',
      render: (_, record) => <div>{record.type}</div>
    },
    {
      title: t('TRUST_SCORE'),
      dataIndex: 'trustScoreUser',
      width: '5%',
      className: '!font-forza',
      align: 'center',
      render: (_, record) => (
        <div>
          {record.trustScoreUser
            ? new BigNumber(record.trustScoreUser).div(1e18).toFixed(2)
            : '0'}
        </div>
      )
    },
    {
      title: t('BOND_AMOUNT'),
      dataIndex: 'batch',
      width: '5%',
      className: '!font-forza',
      align: 'center'
    },
    {
      title: `${t('TOTAL')} ${chainConfig?.currency}`,
      dataIndex: 'eth',
      width: '5%',
      className: '!font-forza',
      align: 'center',
      render: (_, record) => (
        <div>
          {new BigNumber(record.eth).gt(0)
            ? new BigNumber(record.eth).div(1e18).toFixed(7)
            : 'N/A'}
        </div>
      )
    },
    {
      title: t('DATE_TIME'),
      dataIndex: 'timestamp',
      width: '10%',
      className: '!font-forza',
      align: 'center',
      render: (_, record) => {
        // const date = new Date(parseInt(record.timestamp) * 1000);
        // return <div>{getDateTimeInFormat(date)}</div>;
        return (
          <Moment fromNow>{new Date(Number(record.timestamp) * 1000)}</Moment>
        );
      }
    },
    {
      title: t('TXN'),
      width: '5%',
      className: '!font-forza cursor-pointer',
      align: 'center',
      render: (_, record) => (
        <div className="">
          <ExportOutlined
            style={{ color: '#3687D8', fontSize: '15px' }}
            onClick={() => handleOpenResentTx(record.hash, 'tx')}
          />
        </div>
      )
    }
  ];

  useEffect(() => {
    if (userWalletAddress) {
      fetchRecentTxAction({
        page: portfolio.pageRecentTx,
        limit: portfolio.limitRecentTx,
        userWalletAddress: userWalletAddress,
        chainId: chainConfig?.chainId as ChainId
      });
    }
  }, [userWalletAddress]);

  return (
    <div className="h-full w-full bg-white pt-2">
      <div className="!font-forza text-base font-bold">
        {t('RECENT_TRANSACTION')}
      </div>

      <Table
        key={userWalletAddress}
        rowKey="id"
        dataSource={recentTx}
        columns={columns}
        className="!font-forza"
        pagination={{ pageSize: 1000 }}
        scroll={{ x: 300 }}
        bordered
      />
    </div>
  );
};

export default RecentTx;
