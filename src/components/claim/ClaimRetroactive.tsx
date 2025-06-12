/* eslint-disable */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, Tabs, Spin, Alert, Empty, Select, DatePicker, Space, Button } from 'antd';
import { useTranslations } from 'next-intl';
import { useAccount, useChainId } from 'wagmi';
import { ClockCircleOutlined, GiftOutlined, HistoryOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { useClaimRetroActiveCaller } from '@/src/hooks/useClaimRetroActiveCaller';
import { getWeekStartTimestamp, getMonthStartTimestamp } from '@/src/common/utils/utils';
import ClaimCard from './ClaimCard';
import ClaimHistory from './ClaimHistory';
import ClaimDetailsModal from './ClaimDetailsModal';

// Types based on JSON structure
interface RetroactiveClaimData {
  address: string;
  amount: string;
  amountRaw: string;
  proof: string[];
  trustScore: string;
  volume: string;
  type: 'wallet' | 'token';
  owner?: string;
}

interface MerkleTreeData {
  rootHash: string;
  result: Record<string, RetroactiveClaimData>;
}

type ClaimType = 'week' | 'month' | 'quarter' | 'year';

interface ClaimFilters {
  type: ClaimType;
  timestamp: number;
  chainId: number;
}

const ClaimRetroactive = () => {
  const t = useTranslations();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  // Hook for blockchain operations
  const {
    claimStatusLoading,
    claimStatusError,
    claimLoading,
    claimError,
    claimSuccess,
    checkClaimStatus,
    claimWalletReward,
    claimTokenReward,
    resetClaimState,
  } = useClaimRetroActiveCaller();

  // State management
  const [activeTab, setActiveTab] = useState('available');
  const [loading, setLoading] = useState(false);
  const [merkleData, setMerkleData] = useState<MerkleTreeData | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<RetroactiveClaimData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<ClaimFilters>({
    type: 'month',
    timestamp: Math.floor(Date.now() / 1000), // Current timestamp
    chainId: chainId || 80001 // Default to current chainId or fallback
  });

  // Calculate normalized timestamp based on type
  const getNormalizedTimestamp = (type: ClaimType, timestamp: number): number => {
    switch (type) {
      case 'week':
        return getWeekStartTimestamp(timestamp);
      case 'month':
        return getMonthStartTimestamp(timestamp);
      case 'quarter':
        // For quarter, get month start and adjust to quarter start
        const monthStart = getMonthStartTimestamp(timestamp);
        const date = new Date(monthStart * 1000);
        const quarter = Math.floor(date.getMonth() / 3);
        date.setMonth(quarter * 3, 1);
        date.setHours(0, 0, 0, 0);
        return Math.floor(date.getTime() / 1000);
      case 'year':
        // For year, get January 1st of the year
        const yearStart = getMonthStartTimestamp(timestamp);
        const yearDate = new Date(yearStart * 1000);
        yearDate.setMonth(0, 1);
        yearDate.setHours(0, 0, 0, 0);
        return Math.floor(yearDate.getTime() / 1000);
      default:
        return timestamp;
    }
  };

  // Load merkle tree data from JSON file
  const loadMerkleData = async () => {
    setLoading(true);
    try {
      console.log('Loading merkle tree data with filters:', filters);

      // Calculate normalized timestamp based on type
      const normalizedTimestamp = getNormalizedTimestamp(filters.type, filters.timestamp);

      // Construct filename: reward-{type}-{timestamp}-{chainId}.json
      const filename = `reward-${filters.type}-${normalizedTimestamp}-${filters.chainId}.json`;
      const filePath = `/${filename}`;

      console.log('Fetching file:', filePath);

      const response = await fetch(filePath).catch(() => null);

      let data: MerkleTreeData;

      if (response && response.ok) {
        // Load actual JSON file if available
        const jsonData = await response.json();
        data = {
          rootHash: jsonData.rootHash,
          result: jsonData.result
        };
        console.log('Successfully loaded data from:', filename);
      } else {
        console.warn('File not found or failed to load:', filename);
        data = {
          rootHash: '',
          result: {}
        };
      }

      console.log('Loaded merkle data:', data);
      setMerkleData(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load merkle data:', error);
      setLoading(false);
    }
  };

  // Filter eligible claims for connected wallet using useMemo for optimization
  const eligibleClaimsFiltered = useMemo(() => {
    if (!merkleData || !address) return [];

    const eligible: RetroactiveClaimData[] = [];

    Object.entries(merkleData.result).forEach(([claimAddress, claimData]) => {
      // Check wallet claims: connected address matches claim address and type is wallet
      if (claimData.type === 'wallet' && claimAddress.toLowerCase() === address.toLowerCase()) {
        eligible.push({
          ...claimData,
          address: claimAddress,
        });
      }

      // Check token claims: connected address matches owner field and type is token
      if (claimData.type === 'token' && claimData.owner?.toLowerCase() === address.toLowerCase()) {
        eligible.push({
          ...claimData,
          address: claimAddress,
        });
      }
    });

    console.log('Filtered eligible claims:', eligible);
    return eligible;
  }, [merkleData, address]);

  // Handle claim action
  const handleClaim = async (claim: RetroactiveClaimData) => {
    if (!merkleData) return;

    try {
      if (claim.type === 'wallet') {
        await claimWalletReward(claim.amountRaw, claim.proof, merkleData.rootHash);
      } else {
        await claimTokenReward(claim.address, claim.amountRaw, claim.proof, merkleData.rootHash);
      }
    } catch (error) {
      console.error('Claim failed:', error);
    }
  };

  // Show claim details modal
  const showClaimDetails = (claim: RetroactiveClaimData) => {
    setSelectedClaim(claim);
    setModalVisible(true);
  };

  // Update chainId when it changes
  useEffect(() => {
    if (chainId) {
      setFilters(prev => ({
        ...prev,
        chainId
      }));
    }
  }, [chainId]);

  // Load data on mount and when wallet connects
  useEffect(() => {
    if (isConnected) {
      loadMerkleData();
    }
  }, [isConnected]);

  // Reload data when filters change
  useEffect(() => {
    if (isConnected) {
      loadMerkleData();
    }
  }, [filters]);



  // Reset state on claim success
  useEffect(() => {
    if (claimSuccess) {
      // Reload data to update claim status
      loadMerkleData();
      resetClaimState();
    }
  }, [claimSuccess]);

  // Handle filter changes
  const handleFilterChange = (key: keyof ClaimFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle date change from DatePicker
  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const timestamp = Math.floor(date.valueOf() / 1000);
      handleFilterChange('timestamp', timestamp);
    }
  };

  // Get current date value for DatePicker
  const getCurrentDateValue = () => {
    return dayjs(filters.timestamp * 1000);
  };

  // Tab items
  const tabItems = [
    {
      key: 'available',
      label: (
        <span className="flex items-center gap-2 !font-forza">
          <GiftOutlined />
          {t('AVAILABLE_CLAIMS')}
        </span>
      ),
      children: (
        <div className="space-y-4">
          {/* Filter Controls */}
          <Card className="bg-gray-50">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-2">
                <FilterOutlined className="text-blue-500" />
                <span className="!font-forza font-medium">{t('FILTERS')}:</span>
              </div>

              <Space wrap className="flex-1">
                <div className="flex flex-col gap-1">
                  <span className="!font-forza text-xs text-gray-600">{t('PERIOD_TYPE')}</span>
                  <Select
                    value={filters.type}
                    onChange={(value) => handleFilterChange('type', value)}
                    className="w-24"
                    size="small"
                  >
                    <Select.Option value="week">{t('WEEK')}</Select.Option>
                    <Select.Option value="month">{t('MONTH')}</Select.Option>
                    <Select.Option value="quarter">{t('QUARTER')}</Select.Option>
                    <Select.Option value="year">{t('YEAR')}</Select.Option>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="!font-forza text-xs text-gray-600">{t('DATE')}</span>
                  <DatePicker
                    value={getCurrentDateValue()}
                    onChange={handleDateChange}
                    size="small"
                    format="YYYY-MM-DD"
                    allowClear={false}
                  />
                </div>
                <Button
                  icon={<FilterOutlined />}
                  onClick={loadMerkleData}
                  loading={loading}
                  size="small"
                  type="primary"
                  className="!font-forza"
                >
                  {t('APPLY')}
                </Button>
              </Space>
            </div>
          </Card>

          {loading ? (
            <div className="flex justify-center py-8">
              <Spin size="large" />
            </div>
          ) : eligibleClaimsFiltered.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {eligibleClaimsFiltered.map((claim, index) => (
                <ClaimCard
                  key={`${claim.address}-${index}`}
                  claim={claim}
                  onClaim={() => handleClaim(claim)}
                  onViewDetails={() => showClaimDetails(claim)}
                  loading={claimLoading}
                />
              ))}
            </div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="!font-forza text-gray-500">
                  {address ? t('NO_AVAILABLE_CLAIMS') : t('CONNECT_WALLET_TO_VIEW_CLAIMS')}
                </span>
              }
            />
          )}
        </div>
      ),
    },
    {
      key: 'history',
      label: (
        <span className="flex items-center gap-2 !font-forza">
          <HistoryOutlined />
          {t('CLAIM_HISTORY')}
        </span>
      ),
      children: <ClaimHistory />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card
        className="mt-12 w-full"
        bodyStyle={{ padding: 0 }}
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <ClockCircleOutlined className="text-2xl text-blue-500" />
            <h1 className="!font-forza text-2xl font-bold">
              {t('RETROACTIVE_CLAIMS')}
            </h1>
          </div>
          <p className="mt-2 !font-forza text-gray-600">
            {t('CLAIM_RETROACTIVE_REWARDS_DESCRIPTION')}
          </p>
        </div>

        {/* Error Alert */}
        {(claimError || claimStatusError) && (
          <div className="px-6 pt-4">
            <Alert
              message={claimError || claimStatusError}
              type="error"
              showIcon
              closable
              onClose={resetClaimState}
              className="!font-forza"
            />
          </div>
        )}

        {/* Wallet Connection Check */}
        {!isConnected && (
          <div className="px-6 pt-4">
            <Alert
              message={t('WALLET_NOT_CONNECTED')}
              description={t('CONNECT_WALLET_TO_VIEW_CLAIMS')}
              type="warning"
              showIcon
              className="!font-forza"
            />
          </div>
        )}

        {/* Main Content */}
        <div className="p-6">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="!font-forza"
            size="large"
          />
        </div>
      </Card>

      {/* Claim Details Modal */}
      <ClaimDetailsModal
        claim={selectedClaim}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onClaim={selectedClaim ? () => handleClaim(selectedClaim) : undefined}
        loading={claimLoading}
      />
    </motion.div>
  );
};

export default ClaimRetroactive; 