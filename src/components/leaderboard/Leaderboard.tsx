
/* eslint-disable */
import { getTimeKey } from '@/src/common/utils/get-time-key';
import { useConfig } from '@/src/hooks/useConfig';
import {
    useTrustPointDailyWalletToken,
    useTrustPointWeeklyWalletToken
} from '@/src/stores/trust-point/hook';
import BigNumber from 'bignumber.js';

import { shortWalletAddress } from '@/src/common/utils/utils';
import useWindowSize from '@/src/hooks/useWindowSize';
import {
    CalculatorOutlined,
    DollarCircleOutlined,
    FireOutlined,
    HistoryOutlined,
    StarOutlined,
    TrophyOutlined,
    WalletOutlined
} from '@ant-design/icons';
import { Card, Col, message, Row, Spin, Table, Tabs } from 'antd';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const { TabPane } = Tabs;

interface UserLeaderboardEntry {
    rank: number;
    address: string;
    points: string;
    volume: string;
    multiplier?: string;
    lastUpdated: number;
}

interface PoolLeaderboardEntry {
    rank: number;
    tokenTrustPoint: string;
    trustScore: string;
    volume: string;
    multiplier?: string;
    lastUpdated: number;
}

const Leaderboard = () => {
    const [activeTab, setActiveTab] = useState('daily');
    const { isMobile } = useWindowSize();

    const [activeDailySubTab, setActiveDailySubTab] = useState('wallet'); // State cho sub-tab
    const [activeWeeklySubTab, setActiveWeeklySubTab] = useState('wallet'); // State cho sub-tab weekly
    const [loading, setLoading] = useState(true);
    const [loadingWeekly, setLoadingWeekly] = useState(false);
    const [userDailyData, setUserDailyData] = useState<UserLeaderboardEntry[]>(
        []
    );
    const [poolDailyData, setPoolDailyData] = useState<PoolLeaderboardEntry[]>(
        []
    );
    const [userWeeklyData, setUserWeeklyData] = useState<
        UserLeaderboardEntry[]
    >([]); // State cho weekly user data
    const [poolWeeklyData, setPoolWeeklyData] = useState<
        PoolLeaderboardEntry[]
    >([]); // State cho weekly pool data
    const { isConnected, address } = useAccount();

    const router = useRouter();
    const [highlightedUser, setHighlightedUser] = useState<string | null>(null);
    const { chainConfig } = useConfig();

    const { getTrustPointDailyWalletTokenAction, trustPointDailyWalletToken } =
        useTrustPointDailyWalletToken();
    const {
        getTrustPointWeeklyWalletTokenAction,
        trustPointWeeklyWalletToken
    } = useTrustPointWeeklyWalletToken();
    const handleClickAddress = (address: string) => {
        router.push(
            `/${chainConfig?.name.replace(/\s+/g, '').toLowerCase()}/profile/address/${address}`
        );
    };

    const handleClickPoolAddress = (poolId: string) => {
        router.push(
            `/${chainConfig?.name.replace(/\s+/g, '').toLowerCase()}/pool/address/${poolId}`
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!chainConfig?.chainId) {
                console.error('Chain ID not configured.');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const { dayKey } = await getTimeKey();
                await getTrustPointDailyWalletTokenAction({
                    chainId: chainConfig.chainId,
                    dayStartUnix: dayKey
                });

                if (trustPointDailyWalletToken) {
                    const processedUserData = (
                        trustPointDailyWalletToken.data.userTrustScoreDailies ||
                        []
                    ).map((item, index) => ({
                        rank: index + 1,
                        address: item.user.id,
                        points: new BigNumber(item.trustScore)
                            .div(1e18)
                            .toFixed(7),
                        volume: new BigNumber(item.volume).div(1e18).toFixed(7),
                        multiplier: item.user.multiplier,
                        lastUpdated: item.dayStartUnix
                    }));
                    setUserDailyData(processedUserData);

                    const processedPoolData = (
                        trustPointDailyWalletToken.data.poolTrustScoreDailies ||
                        []
                    ).map((item, index) => ({
                        rank: index + 1,
                        poolId: item.pool.id,
                        tokenTrustPoint: item.tokenTrustPoint,
                        trustScore: new BigNumber(item.trustScore)
                            .div(1e18)
                            .toFixed(7),
                        volume: new BigNumber(item.volume).div(1e18).toFixed(7),
                        multiplier: item.pool.multiplier,
                        lastUpdated: item.dayStartUnix
                    }));
                    setPoolDailyData(processedPoolData);
                }
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
                message.error('Failed to load leaderboard data.');
                setUserDailyData([]);
                setPoolDailyData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [chainConfig?.chainId]);

    useEffect(() => {
        const fetchWeeklyData = async () => {
            if (activeTab !== 'weekly' || !chainConfig?.chainId) {
                return; // Chỉ fetch khi tab weekly active và có chainId
            }
            // Chỉ fetch nếu chưa có dữ liệu weekly (tránh fetch lại mỗi khi click tab)
            if (userWeeklyData.length > 0 || poolWeeklyData.length > 0) {
                return;
            }

            try {
                setLoadingWeekly(true);
                const { weekKey } = await getTimeKey();
                await getTrustPointWeeklyWalletTokenAction({
                    chainId: chainConfig.chainId,
                    weekStartUnix: weekKey
                });
                if (trustPointWeeklyWalletToken) {
                    const processedUserData = (
                        trustPointWeeklyWalletToken.data
                            .userTrustScoreWeeklies || []
                    ).map((item, index) => ({
                        rank: index + 1,
                        address: item.user.id,
                        points: new BigNumber(item.trustScore)
                            .div(1e18)
                            .toFixed(7),
                        volume: new BigNumber(item.volume).div(1e18).toFixed(7),
                        multiplier: item.user.multiplier,
                        lastUpdated: item.weekStartUnix
                    }));
                    setUserWeeklyData(processedUserData);

                    const processedPoolData = (
                        trustPointWeeklyWalletToken.data
                            .poolTrustScoreWeeklies || []
                    ).map((item, index) => ({
                        rank: index + 1,
                        poolId: item.pool.id,
                        tokenTrustPoint: new BigNumber(
                            item.tokenTrustPoint || '0'
                        )
                            .div(1e18)
                            .toFixed(7),
                        trustScore: new BigNumber(item.trustScore)
                            .div(1e18)
                            .toFixed(7),
                        volume: new BigNumber(item.volume).div(1e18).toFixed(7),
                        multiplier: item.pool.multiplier,
                        lastUpdated: item.weekStartUnix
                    }));
                    setPoolWeeklyData(processedPoolData);
                }
            } catch (error) {
                console.error('Error fetching weekly leaderboard data:', error);
                message.error('Failed to load weekly leaderboard data.');
                setUserWeeklyData([]);
                setPoolWeeklyData([]);
            } finally {
                setLoadingWeekly(false);
            }
        };

        fetchWeeklyData();
    }, [
        activeTab,
        chainConfig?.chainId,
        getTrustPointWeeklyWalletTokenAction,
        userWeeklyData.length,
        poolWeeklyData.length,
        trustPointWeeklyWalletToken
    ]); 

    const celebrateTopRank = (address: string) => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        setHighlightedUser(address);

        // Reset highlight sau 3 giây
        setTimeout(() => {
            setHighlightedUser(null);
        }, 3000);
    };

    const userColumns = [
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            width: '5%',
            className: '!font-forza',
            render: (rank: number) => (
                <motion.div
                    className="flex items-center justify-center !font-forza"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                >
                    {rank <= 3 ? (
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                repeatDelay: 5
                            }}
                        >
                            <TrophyOutlined
                                className={`text-${rank === 1 ? 'yellow' : rank === 2 ? 'gray' : 'orange'}-500 text-xl`}
                            />
                        </motion.div>
                    ) : (
                        <span className="font-bold">{rank}</span>
                    )}
                </motion.div>
            )
        },
        {
            title: 'Wallet Address',
            dataIndex: 'address',
            key: 'address',
            width: '30%',

            className: '!font-forza',
            render: (address: string) => (
                <motion.div
                    className="flex items-center space-x-2 !font-forza"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <span
                        className="cursor-pointer !font-forza text-blue-400"
                        onClick={() => handleClickAddress(address)}
                    >
                        {isMobile
                            ? shortWalletAddress(address ? address : '')
                            : address}
                    </span>
                </motion.div>
            )
        },
        {
            title: 'Wallet Points',
            dataIndex: 'points',
            key: 'points',
            width: '20%',

            className: '!font-forza',
            sorter: (a: UserLeaderboardEntry, b: UserLeaderboardEntry) =>
                BigInt(a.points || '0') > BigInt(b.points || '0') ? 1 : -1,
            render: (points: string) => (
                <motion.div
                    className="flex items-center space-x-2 !font-forza"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <FireOutlined className="text-orange-500" />
                    <span className="font-bold">{points || '0'}</span>
                </motion.div>
            )
        },
        {
            title: 'Volume',
            dataIndex: 'volume',
            key: 'volume',
            width: '20%',

            className: '!font-forza',
            sorter: (a: UserLeaderboardEntry, b: UserLeaderboardEntry) =>
                BigInt(a.volume || '0') > BigInt(b.volume || '0') ? 1 : -1,
            render: (volume: string) => (
                <span className="!font-forza">{volume || '0'}</span>
            )
        },
        {
            title: 'Last Updated',
            dataIndex: 'lastUpdated',
            key: 'lastUpdated',
            width: '25%',

            className: '!font-forza',
            render: (timestamp: number) => (
                <motion.div
                    className="flex items-center space-x-2 !font-forza"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <HistoryOutlined />
                    <span>
                        {new Date(timestamp * 1000).toLocaleDateString()}
                    </span>
                </motion.div>
            )
        }
    ];

    // Định nghĩa columns cho Pool (Token) Leaderboard

    const poolColumns = [
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            width: 80,
            className: '!font-forza',
            render: (rank: number) => (
                <motion.div
                    className="flex items-center justify-center !font-forza"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                >
                    {rank <= 3 ? (
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                repeatDelay: 5
                            }}
                        >
                            <TrophyOutlined
                                className={`text-${rank === 1 ? 'yellow' : rank === 2 ? 'gray' : 'orange'}-500 text-xl`}
                            />
                        </motion.div>
                    ) : (
                        <span className="font-forza">{rank}</span>
                    )}
                </motion.div>
            )
        },
        {
            title: 'Token (Pool ID)',
            dataIndex: 'poolId',
            key: 'poolId',
            className: '!font-forza',
            render: (poolId: string) => (
                <motion.div
                    className="flex items-center space-x-2 !font-forza"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <span
                        className="cursor-pointer !font-forza text-blue-400 "
                        onClick={() => handleClickPoolAddress(poolId)}
                    >
                        {isMobile
                            ? shortWalletAddress(poolId ? poolId : '')
                            : poolId}
                    </span>
                </motion.div>
            )
        },
       
        {
            title: 'Pool Score',
            dataIndex: 'trustScore',
            key: 'trustScore',
            className: '!font-forza',
            sorter: (a: PoolLeaderboardEntry, b: PoolLeaderboardEntry) =>
                BigInt(a.trustScore || '0') > BigInt(b.trustScore || '0')
                    ? 1
                    : -1,
            render: (score: string) => (
                <motion.div
                    className="flex items-center space-x-2 !font-forza"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <StarOutlined className="text-blue-500" />
                    <span className="font-bold">{score || '0'}</span>
                </motion.div>
            )
        },
        {
            title: 'Volume',
            dataIndex: 'volume',
            key: 'volume',
            className: '!font-forza',
            sorter: (a: PoolLeaderboardEntry, b: PoolLeaderboardEntry) =>
                BigInt(a.volume || '0') > BigInt(b.volume || '0') ? 1 : -1,
            render: (volume: string) => (
                <span className="font-forza">{volume || '0'}</span>
            )
        },
        {
            title: 'Last Updated',
            dataIndex: 'lastUpdated',
            key: 'lastUpdated',
            className: '!font-forza',
            render: (timestamp: number) => (
                <motion.div
                    className="flex items-center space-x-2 !font-forza"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <HistoryOutlined />
                    <span>
                        {new Date(timestamp * 1000).toLocaleDateString()}
                    </span>
                </motion.div>
            )
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card
                className="mt-3 w-full "
                bodyStyle={{ padding: 0 }}
            >
                <div className="mt-2 px-4 pt-6">
                    <Row gutter={[10, 10]}>
                        <Col
                            xs={24}
                            sm={24}
                            lg={12}
                            md={12}
                            xxl={12}
                            className="!font-forza"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <h1 className="mb-2 text-2xl font-bold">
                                    Leaderboard
                                </h1>
                                <p className="text-gray-500">
                                    Track your ranking and earn BERA tokens
                                    based on your activity
                                </p>
                            </motion.div>
                        </Col>
                        <Col
                            xs={24}
                            sm={24}
                            lg={12}
                            md={12}
                            xxl={12}
                            className="!font-forza"
                        >
                            <motion.div
                                className="mt-4 w-full rounded-lg bg-gray-50 p-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                whileHover={{ scale: 1.01 }}
                            >
                                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                                    <CalculatorOutlined /> Point Calculation
                                    Formula
                                </h3>

                                <div className="space-y-3 rounded-md border border-gray-200 bg-white p-3 shadow-sm">
                                    <div className="flex items-start gap-2">
                                        <WalletOutlined className="mt-1 text-blue-500" />
                                        <div>
                                            <span className="font-medium">
                                                Wallet Trust Points (TP)
                                            </span>{' '}
                                            =
                                            <code className="ml-1 rounded bg-blue-50 px-1 py-0.5 text-blue-700">
                                                Multiplier (Wallet)
                                            </code>{' '}
                                            ×
                                            <code className="bg-green-50 text-green-700 ml-1 rounded px-1 py-0.5">
                                                Invested Volume
                                            </code>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <DollarCircleOutlined className="mt-1 text-purple-500" />
                                        <div>
                                            <span className="font-medium">
                                                Token Trust Points (TP)
                                            </span>{' '}
                                            =
                                            <code className="ml-1 rounded bg-purple-50 px-1 py-0.5 text-purple-700">
                                                Multiplier (Token)
                                            </code>{' '}
                                            × Σ (
                                            <code className="ml-1 rounded bg-red-50 px-1 py-0.5 text-red-700">
                                                Transaction Volume
                                            </code>{' '}
                                            ×
                                            <code className="ml-1 rounded bg-blue-50 px-1 py-0.5 text-blue-700">
                                                Multiplier (Wallet)
                                            </code>
                                            )
                                        </div>
                                    </div>
                                    <p className="!mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
                                        * Multipliers and specific calculation
                                        details may vary.
                                    </p>
                                </div>
                            </motion.div>
                        </Col>
                    </Row>
                </div>

                <div className="px-4 pb-6">
                    <Tabs
                        activeKey={activeTab}
                        onChange={(key) => setActiveTab(key)}
                    >
                        <TabPane
                            tab="Daily Ranking"
                            key="daily"
                            className="!font-forza"
                        >
                            <Tabs
                                activeKey={activeDailySubTab}
                                onChange={setActiveDailySubTab}
                                type="card"
                                size="small"
                                className="mb-4"
                            >
                                <TabPane
                                    tab="Wallet Ranking"
                                    key="wallet"
                                >
                                    {loading ? (
                                        <div className="flex h-64 items-center justify-center">
                                            <Spin size="large" />
                                        </div>
                                    ) : (
                                        <AnimatePresence>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Table
                                                    dataSource={userDailyData}
                                                    columns={userColumns}
                                                    rowKey="address"
                                                    pagination={false}
                                                    scroll={{
                                                        x: 'max-content'
                                                    }}
                                                    onRow={(record) => ({
                                                        onClick: () =>
                                                            record.rank === 1 &&
                                                            celebrateTopRank(
                                                                record.address
                                                            ),
                                                        className:
                                                            highlightedUser ===
                                                            record.address
                                                                ? 'bg-yellow-50 transition-colors duration-300'
                                                                : ''
                                                    })}
                                                />
                                            </motion.div>
                                        </AnimatePresence>
                                    )}
                                </TabPane>
                                <TabPane
                                    tab="Token Ranking"
                                    key="token"
                                >
                                    {loading ? (
                                        <div className="flex h-64 items-center justify-center">
                                            <Spin size="large" />
                                        </div>
                                    ) : (
                                        <AnimatePresence>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Table
                                                    dataSource={poolDailyData}
                                                    columns={poolColumns}
                                                    rowKey="poolId"
                                                    pagination={false}
                                                    scroll={{
                                                        x: 'max-content'
                                                    }}
                                                />
                                            </motion.div>
                                        </AnimatePresence>
                                    )}
                                </TabPane>
                            </Tabs>
                        </TabPane>

                        <TabPane
                            tab="Weekly Retroactive"
                            key="weekly"
                            className="!font-forza"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* <div className="mb-4 rounded-lg bg-yellow-50 p-4">
                                    <h3 className="text-lg font-semibold text-yellow-800">
                                        Weekly Retroactive Distribution
                                    </h3>
                                    <p className="text-yellow-700">
                                        Rewards will be distributed every Sunday
                                        at 00:00 UTC
                                    </p>
                                </div> */}
                                <Tabs
                                    activeKey={activeWeeklySubTab}
                                    onChange={setActiveWeeklySubTab}
                                    type="card"
                                    size="small"
                                    className="mb-4"
                                >
                                    <TabPane
                                        tab="Wallet Ranking"
                                        key="wallet"
                                    >
                                        {loadingWeekly ? (
                                            <div className="flex h-64 items-center justify-center">
                                                <Spin size="large" />
                                            </div>
                                        ) : (
                                            <AnimatePresence>
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{
                                                        duration: 0.3
                                                    }}
                                                >
                                                    <Table
                                                        dataSource={
                                                            userWeeklyData
                                                        }
                                                        columns={userColumns}
                                                        rowKey="address"
                                                        pagination={false}
                                                        scroll={{
                                                            x: 'max-content'
                                                        }}
                                                    />
                                                </motion.div>
                                            </AnimatePresence>
                                        )}
                                    </TabPane>
                                    <TabPane
                                        tab="Token Ranking"
                                        key="token"
                                    >
                                        {loadingWeekly ? (
                                            <div className="flex h-64 items-center justify-center">
                                                <Spin size="large" />
                                            </div>
                                        ) : (
                                            <AnimatePresence>
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{
                                                        duration: 0.3
                                                    }}
                                                >
                                                    <Table
                                                        dataSource={
                                                            poolWeeklyData
                                                        }
                                                        columns={poolColumns}
                                                        rowKey="poolId"
                                                        pagination={false}
                                                        scroll={{
                                                            x: 'max-content'
                                                        }}
                                                    />
                                                </motion.div>
                                            </AnimatePresence>
                                        )}
                                    </TabPane>
                                </Tabs>
                            </motion.div>
                        </TabPane>
                    </Tabs>
                </div>
            </Card>
        </motion.div>
    );
};

export default Leaderboard;
