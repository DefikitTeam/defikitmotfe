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

const { RangePicker } = DatePicker;
const { Option } = Select;

interface ClaimHistoryItem {
  id: string;
  claimDate: string;
  claimType: 'wallet' | 'token';
  address: string;
  amountClaimed: string;
  transactionHash: string;
  trustScore: string;
  volume: string;
  status: 'success' | 'pending' | 'failed';
}

const ClaimHistory = () => {
  const t = useTranslations();

  // State for filters
  const [loading, setLoading] = useState(false);
  const [claimTypeFilter, setClaimTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<any>(null);

  // Mock data - will be replaced with actual data loading
  const [historyData, setHistoryData] = useState<ClaimHistoryItem[]>([]);

  // Load claim history 
  const loadClaimHistory = async () => {
    setLoading(true);
    try {
      console.log('Loading claim history...');

      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock claim history data - in production this would come from API/blockchain
      const mockHistoryData: ClaimHistoryItem[] = [
        {
          id: '1',
          claimDate: '2024-01-15T10:30:00Z',
          claimType: 'wallet',
          address: '0xa55de842dd45ddf55c8c3d42176847f9f9e8da92',
          amountClaimed: '1.6975',
          transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          trustScore: '2.8279',
          volume: '0.4040',
          status: 'success'
        },
        {
          id: '2',
          claimDate: '2024-01-10T14:20:00Z',
          claimType: 'token',
          address: '0x54f7d66dbf3cd53f3faec10af5c5db186d177d73',
          amountClaimed: '5.8326',
          transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          trustScore: '10.7854',
          volume: '0.5402',
          status: 'success'
        },
        {
          id: '3',
          claimDate: '2024-01-05T09:15:00Z',
          claimType: 'wallet',
          address: '0xc0105056cbc1fa68eda7036947b86eb6c378ae08',
          amountClaimed: '1.2265',
          transactionHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
          trustScore: '2.0433',
          volume: '0.3406',
          status: 'success'
        }
      ];

      console.log('Loaded claim history:', mockHistoryData);
      setHistoryData(mockHistoryData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load claim history:', error);
      setLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    return num.toFixed(4);
  };

  const openTransactionInExplorer = (txHash: string) => {
    // TODO: Get explorer URL from config
    const explorerUrl = `https://etherscan.io/tx/${txHash}`;
    window.open(explorerUrl, '_blank');
  };

  const getClaimTypeTag = (type: 'wallet' | 'token') => {
    const config = {
      wallet: {
        color: 'blue',
        icon: <WalletOutlined />,
        text: t('WALLET_REWARD')
      },
      token: {
        color: 'green',
        icon: <GoldOutlined />,
        text: t('TOKEN_REWARD')
      }
    };

    const { color, icon, text } = config[type];

    return (
      <Tag color={color} icon={icon} className="!font-forza">
        {text}
      </Tag>
    );
  };

  const getStatusTag = (status: 'success' | 'pending' | 'failed') => {
    const config = {
      success: { color: 'success', text: t('SUCCESS') },
      pending: { color: 'processing', text: t('PENDING') },
      failed: { color: 'error', text: t('FAILED') }
    };

    const { color, text } = config[status];

    return (
      <Tag color={color} className="!font-forza">
        {text}
      </Tag>
    );
  };

  // Table columns
  const columns: ColumnsType<ClaimHistoryItem> = [
    {
      title: t('CLAIM_DATE'),
      dataIndex: 'claimDate',
      key: 'claimDate',
      width: 120,
      render: (date: string) => (
        <div className="!font-forza text-sm">
          {dayjs(date).format('MMM DD, YYYY')}
        </div>
      ),
      sorter: (a, b) => dayjs(a.claimDate).unix() - dayjs(b.claimDate).unix(),
    },
    {
      title: t('TYPE'),
      dataIndex: 'claimType',
      key: 'claimType',
      width: 120,
      render: (type: 'wallet' | 'token') => getClaimTypeTag(type),
      filters: [
        { text: t('WALLET_REWARD'), value: 'wallet' },
        { text: t('TOKEN_REWARD'), value: 'token' },
      ],
      onFilter: (value: any, record) => record.claimType === value,
    },
    {
      title: t('ADDRESS'),
      dataIndex: 'address',
      key: 'address',
      width: 140,
      render: (address: string) => (
        <div className="!font-forza font-mono text-sm">
          {formatAddress(address)}
        </div>
      ),
    },
    {
      title: t('AMOUNT'),
      dataIndex: 'amountClaimed',
      key: 'amountClaimed',
      width: 120,
      render: (amount: string) => (
        <div className="!font-forza font-semibold text-green-600">
          {formatAmount(amount)}
        </div>
      ),
      sorter: (a, b) => parseFloat(a.amountClaimed) - parseFloat(b.amountClaimed),
    },
    {
      title: t('TRUST_SCORE'),
      dataIndex: 'trustScore',
      key: 'trustScore',
      width: 100,
      render: (score: string) => (
        <div className="!font-forza text-sm text-orange-600">
          {parseFloat(score).toFixed(2)}
        </div>
      ),
    },
    {
      title: t('VOLUME'),
      dataIndex: 'volume',
      key: 'volume',
      width: 100,
      render: (volume: string) => (
        <div className="!font-forza text-sm text-purple-600">
          {parseFloat(volume).toFixed(2)}
        </div>
      ),
    },
    {
      title: t('STATUS'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: 'success' | 'pending' | 'failed') => getStatusTag(status),
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
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Space className="flex-wrap">
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-gray-500" />
            <span className="!font-forza text-sm text-gray-600">
              {t('DATE_RANGE')}:
            </span>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              className="!font-forza"
              size="small"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="!font-forza text-sm text-gray-600">
              {t('TYPE')}:
            </span>
            <Select
              value={claimTypeFilter}
              onChange={setClaimTypeFilter}
              className="!font-forza"
              style={{ width: 120 }}
              size="small"
            >
              <Option value="all">{t('ALL')}</Option>
              <Option value="wallet">{t('WALLET')}</Option>
              <Option value="token">{t('TOKEN')}</Option>
            </Select>
          </div>
        </Space>
      </div>

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