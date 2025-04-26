import React, { useState, useEffect } from 'react';
import { Card, Table, Tabs, Badge, Tooltip, Progress, Spin } from 'antd';
import { TrophyOutlined, FireOutlined, StarOutlined, HistoryOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { formatNumber } from '@/src/common/utils/format';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const { TabPane } = Tabs;

interface LeaderboardEntry {
    rank: number;
    address: string;
    points: number;
    estimatedBera: number;
    volumeInvest: number;
    createToken: number;
    socialPoint: number;
    lastUpdated: string;
    rankChange?: number; // Thêm trường để theo dõi thay đổi rank
}

const Leaderboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('daily');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<LeaderboardEntry[]>([]);
    const [highlightedUser, setHighlightedUser] = useState<string | null>(null);

    // Mock data - sẽ được thay thế bằng data thật
    const mockData: LeaderboardEntry[] = [
        {
            rank: 1,
            address: '0x1234...5678',
            points: 1500,
            estimatedBera: 100,
            volumeInvest: 50000,
            createToken: 3,
            socialPoint: 800,
            lastUpdated: '2024-04-08',
            rankChange: 2
        },
        {
            rank: 2,
            address: '0x8765...4321',
            points: 1200,
            estimatedBera: 80,
            volumeInvest: 40000,
            createToken: 2,
            socialPoint: 600,
            lastUpdated: '2024-04-08',
            rankChange: -1
        },
        {
            rank: 3,
            address: '0xabcd...efgh',
            points: 1000,
            estimatedBera: 70,
            volumeInvest: 35000,
            createToken: 1,
            socialPoint: 500,
            lastUpdated: '2024-04-08',
            rankChange: 0
        },
        // Thêm mock data khác...
    ];

    // Giả lập loading và animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setData(mockData);
            setLoading(false);

            // Trigger confetti for top 3
            if (mockData.length >= 3) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // Hàm để trigger confetti khi user đạt top 1
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

    const columns = [
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            width: 80,
            render: (rank: number, record: LeaderboardEntry) => (
                <motion.div
                    className="flex items-center justify-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                >
                    {rank <= 3 ? (
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
                        >
                            <TrophyOutlined className={`text-${rank === 1 ? 'yellow' : rank === 2 ? 'gray' : 'orange'}-500 text-xl`} />
                        </motion.div>
                    ) : (
                        <span className="font-bold">{rank}</span>
                    )}
                    {record.rankChange !== undefined && record.rankChange !== 0 && (
                        <motion.div
                            className={`ml-2 ${record.rankChange > 0 ? 'text-green-500' : 'text-red-500'}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {record.rankChange > 0 ? <RiseOutlined /> : <FallOutlined />}
                            <span className="ml-1">{Math.abs(record.rankChange)}</span>
                        </motion.div>
                    )}
                </motion.div>
            ),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: (address: string) => (
                <motion.div
                    className="flex items-center space-x-2"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <span className="font-mono">{address}</span>
                    {/* <Badge status="success" text="Active" /> */}
                </motion.div>
            ),
        },
        {
            title: 'Points',
            dataIndex: 'points',
            key: 'points',
            sorter: (a: LeaderboardEntry, b: LeaderboardEntry) => a.points - b.points,
            render: (points: number) => (
                <motion.div
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <motion.div
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                    >
                        <FireOutlined className="text-orange-500" />
                    </motion.div>
                    <span className="font-bold">{formatNumber(points)}</span>
                </motion.div>
            ),
        },

        // {
        //     title: 'Est. Bera',
        //     dataIndex: 'estimatedBera',
        //     key: 'estimatedBera',
        //     render: (bera: number) => (
        //         <motion.div
        //             className="flex items-center space-x-2"
        //             whileHover={{ scale: 1.05 }}
        //             transition={{ type: "spring", stiffness: 300 }}
        //         >
        //             <motion.div
        //                 animate={{ rotate: [0, 360] }}
        //                 transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
        //             >
        //                 <StarOutlined className="text-yellow-500" />
        //             </motion.div>
        //             <span className="font-bold">{formatNumber(bera)} BERA</span>
        //         </motion.div>
        //     ),
        // },

        {
            title: 'Activity Breakdown',
            key: 'breakdown',
            render: (record: LeaderboardEntry) => (
                <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Tooltip title="Volume Invest">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Progress
                                percent={Math.round((record.volumeInvest / 100000) * 100)}
                                size="small"
                                strokeColor="#52c41a"
                                strokeLinecap="round"
                            />
                        </motion.div>
                    </Tooltip>
                    <Tooltip title="Create Token">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Progress
                                percent={Math.round((record.createToken / 5) * 100)}
                                size="small"
                                strokeColor="#1890ff"
                                strokeLinecap="round"
                            />
                        </motion.div>
                    </Tooltip>
                    <Tooltip title="Social Points">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Progress
                                percent={Math.round((record.socialPoint / 1000) * 100)}
                                size="small"
                                strokeColor="#722ed1"
                                strokeLinecap="round"
                            />
                        </motion.div>
                    </Tooltip>
                </motion.div>
            ),
        },
        {
            title: 'Last Updated',
            dataIndex: 'lastUpdated',
            key: 'lastUpdated',
            render: (date: string) => (
                <motion.div
                    className="flex items-center space-x-2"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <HistoryOutlined />
                    <span>{date}</span>
                </motion.div>
            ),
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="w-full mt-3" bodyStyle={{ padding: 0 }}>
                <div className="block md:flex md:justify-between md:items-start px-4 pt-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h1 className="text-2xl font-bold mb-2">Leaderboard</h1>
                        <p className="text-gray-500">
                            Track your ranking and earn BERA tokens based on your activity
                        </p>
                    </motion.div>

                    <motion.div
                        className="p-4 bg-gray-50 rounded-lg w-full md:w-1/3 mt-4 md:mt-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        whileHover={{ scale: 1.01 }}
                    >
                        <h3 className="text-lg font-semibold mb-2">Point Calculation Formula</h3>
                        <div className="space-y-2">
                            <p>Total Points = (Volume Invest × 0.4) + (Create Token × 0.3) + (Social Point × 0.3)</p>
                            <p>Estimated BERA = Total Points × Conversion Rate</p>
                            <p className="text-sm text-gray-500">
                                * Final formula and conversion rates are subject to change
                            </p>
                        </div>
                    </motion.div>
                </div>

                <div className="px-4 pb-6">
                    <Tabs activeKey={activeTab} onChange={setActiveTab}>
                        <TabPane tab="Daily Ranking" key="daily">
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
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
                                            dataSource={data}
                                            columns={columns}
                                            rowKey="address"
                                            pagination={{ pageSize: 10 }}
                                            onRow={(record) => ({
                                                onClick: () => record.rank === 1 && celebrateTopRank(record.address),
                                                className: highlightedUser === record.address ? 'bg-yellow-50 transition-colors duration-300' : '',
                                            })}
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            )}
                        </TabPane>
                        <TabPane tab="Weekly Retroactive" key="weekly">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                                    <h3 className="text-lg font-semibold text-yellow-800">Weekly Retroactive Distribution</h3>
                                    <p className="text-yellow-700">
                                        Rewards will be distributed every Sunday at 00:00 UTC
                                    </p>
                                </div>
                                <Table
                                    dataSource={data}
                                    columns={columns}
                                    rowKey="address"
                                    pagination={{ pageSize: 10 }}
                                />
                            </motion.div>
                        </TabPane>
                    </Tabs>
                </div>
            </Card>
        </motion.div>
    );
};

export default Leaderboard; 