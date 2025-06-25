/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';
import { Table, Tag, Button, DatePicker, Select, Space, Empty } from 'antd';
import { useTranslations } from 'next-intl';
import {
  LinkOutlined,
  WalletOutlined,
  GoldOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import serviceDistribution from '@/src/services/external-services/backend-server/distribution';
import { useChainId } from 'wagmi';
import BigNumber from 'bignumber.js';
import { ConfigService } from '@/src/config/services/config-service';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface ClaimHistoryItem {
  id: string;
  user: {
    id: string;
  };
  campaign: {
    id: string;
    description: string;
  };
  campaignType: string;
  timestamp: string;
  amount: string;
  transactionHash: string;
  blockNumber: string;
  blockTimestamp: string;
}

const ClaimHistory = () => {
  const t = useTranslations();
  const chainId = useChainId();

  // State for filters
  const [loading, setLoading] = useState(false);
  const [claimTypeFilter, setClaimTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<any>(null);

  const config = ConfigService.getInstance();
  const explorerUrl = config.getExplorer(chainId || 80069);

  // Mock data - will be replaced with actual data loading
  const [historyData, setHistoryData] = useState<ClaimHistoryItem[]>([]);

  // Load claim history 
  const loadClaimHistory = async () => {
    setLoading(true);
    try {
      const response = await serviceDistribution.getHistoryTransaction({ chainId: chainId || 80069 });
      const data = await response.json();
      const formattedData = data.data.distributionClaims;
      setHistoryData(formattedData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load claim history:', error);
      setLoading(false);
    }
  };


  const formatAmount = (amount: string) => {
    return `${new BigNumber(amount || 0).div(1e18).toFixed(4)} BERA`;
  };

  const openTransactionInExplorer = (txHash: string) => {
    // TODO: Get explorer URL from config
    window.open(`${explorerUrl}/tx/${txHash}`, '_blank');
  };


  // Table columns
  const columns: ColumnsType<ClaimHistoryItem> = [
    {
      title: t('CLAIM_DATE'),
      dataIndex: 'blockTimestamp',
      key: 'blockTimestamp',
      width: 120,
      render: (blockTimestamp: string) => (
        <div className="!font-forza text-sm">
          {dayjs(parseInt(blockTimestamp) * 1000).format('MMM DD, YYYY')}
        </div>
      ),
      sorter: (a, b) => parseInt(a.blockTimestamp) - parseInt(b.blockTimestamp),
    },
    {
      title: t('ADDRESS'),
      dataIndex: 'user',
      key: 'address',
      width: 140,
      render: (user: { id: string }) => (
        <div className="!font-forza font-mono text-sm">
          {user.id}
        </div>
      ),
    },
    {
      title: t('AMOUNT'),
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: string) => (
        <div className="!font-forza font-semibold text-green-600">
          {formatAmount(amount)}
        </div>
      ),
      sorter: (a, b) => parseFloat(a.amount) - parseFloat(b.amount),
    },
    {
      title: t('CAMPAIGN'),
      dataIndex: 'campaign',
      key: 'campaign',
      width: 120,
      render: (campaign: { description: string }) => (
        <div className="!font-forza font-mono text-sm">
          {campaign.description}
        </div>
      ),
    },
    {
      title: t('TYPE'),
      dataIndex: 'campaignType',
      key: 'campaignType',
      width: 120,
      render: (campaignType: string) => (
        <div className="!font-forza font-mono text-sm">
          {campaignType}
        </div>
      ),
    },
    {
      title: t('TRANSACTION'),
      dataIndex: 'transactionHash',
      key: 'transactionHash',
      width: 120,
      render: (txHash: string) => (
        <Button
          type="link"
          size="small"
          icon={<LinkOutlined />}
          onClick={() => openTransactionInExplorer(txHash)}
          className="!font-forza !p-0"
        >
          {t('VIEW')}
        </Button>
      ),
    },
  ];

  // Load claim history on component mount
  useEffect(() => {
    loadClaimHistory();
  }, []);

  return (
    <div className="space-y-4">
      {/* Claims History Table */}
      <Table
        columns={columns}
        dataSource={historyData}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => (
            <span className="!font-forza text-sm text-gray-600">
              {`${range[0]}-${range[1]} of ${total} claims`}
            </span>
          ),
        }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="!font-forza text-gray-500">
                  {t('NO_CLAIM_HISTORY')}
                </span>
              }
            />
          ),
        }}
        className="!font-forza"
        size="small"
      />
    </div>
  );
};

export default ClaimHistory; 