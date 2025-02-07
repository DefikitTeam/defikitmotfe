/* eslint-disable */
'use client';
import {
    ChainId,
    DropdownObject,
    POOL_STATE,
    PoolStatus,
    poolStates
} from '@/src/common/constant/constance';
import BoxArea from '@/src/components/common/box-area';
import SearchComponent from '@/src/components/common/search';
import EmptyPool from '@/src/components/empty';
import useWindowSize from '@/src/hooks/useWindowSize';
import { useListPool } from '@/src/stores/pool/hook';
import { IPoolList } from '@/src/stores/pool/type';
import { EActionStatus } from '@/src/stores/type';
import { Select, Spin, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { use, useCallback, useEffect, useRef, useState } from 'react';
import ItemPool from './item-pool';
import { useAccount } from 'wagmi';
import useCurrentChainInformation from '@/src/hooks/useCurrentChainInformation';
import TelegramLoginButton from '@/src/components/common/telegram';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/stores';
const { Option } = Select;
const { Text } = Typography;

const HomePage = () => {
    const t = useTranslations();
    const {
        poolStateList,
        getListPoolAction,
        getListPoolBackgroundAction,
        setFilterAction,
        updateCalculatePoolAction
    } = useListPool();
    const { address, chainId, chain } = useAccount();
    const { analystData, metadata, priceNative, poolList, filter } =
        poolStateList;
    const [allPool, setAllPool] = useState<IPoolList[]>([]);
    const chainData = useSelector((state: RootState) => state.chainData);
    const [poolState, setPoolState] = useState(PoolStatus.ACTIVE);
    const [query, setQuery] = useState('');
    const { isMobile } = useWindowSize();
    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [repeat, setRepeat] = useState<boolean>(false);
    const [stopInterval, setStopInterval] = useState<boolean>(false);

    useEffect(() => {
        getListPoolAction({
            statusPool: filter,
            chainId: chainData.chainData.chainId,
            metaDataFromStore: metadata,
            query: '',
            owner: address
        });
        setPoolState(filter);
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    useEffect(() => {
        if (!poolList && !priceNative) return;
        updateCalculatePoolAction({
            pools: poolList,
            priceNative: priceNative,
            metaDataFromStore: metadata
        });
    }, [priceNative, poolList]);

    useEffect(() => {
        if (poolStateList.poolList) {
            setAllPool(poolStateList.poolList.slice().reverse());
        }
    }, [poolStateList.poolList]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [allPool]);

    useEffect(() => {
        if (filter !== PoolStatus.ACTIVE || query) {
            setStopInterval(true);
            fetchPoolList();
            return;
        }
        if (stopInterval) {
            fetchPoolList();
        }
        setStopInterval(false);
        setTimeout(() => {
            setRepeat(!repeat);
        }, 5000);
    }, [
        poolStateList.filter,
        chainData.chainData.chainId,
        filter,
        query,
        repeat,
        stopInterval,
        address
    ]);

    useEffect(() => {
        if (!stopInterval) {
            fetchPoolList();
        }
    }, [repeat, stopInterval]);

    const fetchPoolList = () => {
        getListPoolBackgroundAction({
            statusPool: filter,
            query: query,
            owner: address,
            chainId: chainData.chainData.chainId || ChainId.BARTIO
        });
    };

    const handleInputChange = (value: string) => {
        setQuery(value);
    };

    const handleSelectChange = (value: string) => {
        setPoolState(value as PoolStatus);
        switch (value) {
            case PoolStatus.MY_POOl:
                setFilterAction(PoolStatus.MY_POOl);
                break;
            case PoolStatus.ACTIVE:
                setFilterAction(PoolStatus.ACTIVE);
                break;
            case PoolStatus.UP_COMING:
                setFilterAction(PoolStatus.UP_COMING);

                break;
            case PoolStatus.FULL:
                setFilterAction(PoolStatus.FULL);
                break;
            case PoolStatus.FAIL:
                setFilterAction(PoolStatus.FAIL);
                break;
            case PoolStatus.FINISHED:
                setFilterAction(PoolStatus.FINISHED);
                break;
            case PoolStatus.COMPLETED:
                setFilterAction(PoolStatus.COMPLETED);
                break;
            default:
                setFilterAction(PoolStatus.ACTIVE);
                break;
        }
    };

    return (
        <BoxArea>
            <div
                className={`${
                    isMobile
                        ? 'mt-4 flex min-h-screen flex-col justify-end overflow-auto text-center'
                        : 'px-8 py-10 text-center'
                }`}
            >
                <Spin
                    spinning={poolStateList.status === EActionStatus.Pending}
                    delay={0}
                >
                    <div className="listTokens mt-1 max-h-[70vh] overflow-y-auto overflow-x-hidden">
                        <div className="grid gap-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 xs:grid-cols-1 xxl:grid-cols-3 ">
                            {allPool.length === 0 && (
                                <div className="col-span-full">
                                    <EmptyPool />
                                </div>
                            )}
                            {allPool &&
                                allPool.length > 0 &&
                                allPool?.map((pool: IPoolList, index) => {
                                    return (
                                        <ItemPool
                                            poolItem={pool}
                                            key={pool.id}
                                            onClick={() =>
                                                router.push(
                                                    `/${chainData.chainData.name.replace(/\s+/g, '').toLowerCase()}/pool/${pool.id}`
                                                )
                                            }
                                            className={`${
                                                (index + 1) % 2 === 0
                                                    ? 'bg-evenColor'
                                                    : 'bg-oddColor'
                                            }  ${index === allPool.length - 1 ? 'animate-newMessage' : ''}  `}
                                            metadata={
                                                metadata && metadata?.[pool.id]
                                                    ? metadata[pool.id].metadata
                                                    : undefined
                                            }
                                            analysisData={
                                                (analystData &&
                                                    analystData[pool.id]
                                                        ?.analystData) ||
                                                undefined
                                            }
                                            priceNative={priceNative}
                                        />
                                    );
                                })}
                        </div>
                        <div ref={messagesEndRef}></div>
                    </div>
                </Spin>

                <div
                    className={`${isMobile ? 'mt-5 w-full' : 'm-auto w-[40%]'} mt-5`}
                >
                    <Text
                        className="drop-shadow-textShadow animate-blink cursor-pointer bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text !font-forza !text-xl !font-bold text-transparent"
                        onClick={() => router.push('/create-launch')}
                    >
                        Start a Token/Launch
                    </Text>
                </div>

                <div className={`${isMobile ? 'w-full' : 'm-auto w-[40%]'}`}>
                    <SearchComponent
                        placeholder={t(
                            'SEARCH_FOR_TOKEN_HERE_(NAME_OR_CONTRACT_ADDRESS_)'
                        )}
                        className="!mb-2 w-full !px-2 !font-forza"
                        onChange={handleInputChange}
                    />

                    <div className="mt-5 flex justify-center space-x-4">
                        <Select
                            className="h-10 bg-white !font-forza text-black"
                            style={{
                                width: '130px',
                                border: '1px solid darkgrey',
                                borderRadius: '5px'
                            }}
                            placeholder={poolState}
                            onChange={handleSelectChange}
                        >
                            <Option
                                value=""
                                disabled
                            >
                                <em>{poolState}</em>
                            </Option>

                            {address
                                ? poolStates.map(
                                      (item: DropdownObject, key) => (
                                          <Option
                                              className="!font-forza"
                                              value={item.value}
                                              key={key}
                                          >
                                              {item.text}
                                          </Option>
                                      )
                                  )
                                : poolStates
                                      .slice(1, 6)
                                      .map((item: DropdownObject, key) => (
                                          <Option
                                              className="!font-forza"
                                              value={item.value}
                                              key={key}
                                          >
                                              {item.text}
                                          </Option>
                                      ))}
                        </Select>
                    </div>
                </div>
            </div>
        </BoxArea>
    );
};

export default HomePage;
