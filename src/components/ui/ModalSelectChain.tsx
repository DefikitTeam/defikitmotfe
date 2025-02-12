import { chains } from '@/src/common/constant/constance';
import { NEXT_PUBLIC_DOMAIN_MULTIPLE_STG } from '@/src/common/web3/constants/env';
import { IChainInfor } from '@/src/hooks/useCurrentChainInformation';
import useCurrentHostNameInformation from '@/src/hooks/useCurrentHostName';
import useWindowSize from '@/src/hooks/useWindowSize';
import { RootState } from '@/src/stores';
import { setChainData } from '@/src/stores/Chain/chainDataSlice';
import { CaretDownOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ModalSelectChain = () => {
    const { isMobile } = useWindowSize();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const currentHostname = useCurrentHostNameInformation();
    const chainData = useSelector(
        (state: RootState) => state.chainData.chainData
    );
    const dispatch = useDispatch();
    const pathname = usePathname();
    const router = useRouter();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleChangeChain = (chain: IChainInfor) => {
        setIsModalOpen(false);
        dispatch(setChainData(chain));
        router.push(`/${chain.name.replace(/\s+/g, '').toLowerCase()}`);
    };

    useEffect(() => {
        const currentPath = pathname?.split('/');
        if (currentPath?.length === 2) {
            router.push(`/${chainData.name.replace(/\s+/g, '').toLowerCase()}`);
        }
    }, [chainData.name, pathname, router]);

    let listChainIds: number[] = [];
    if (currentHostname.url === NEXT_PUBLIC_DOMAIN_MULTIPLE_STG) {
        listChainIds = [80084, 84532, 80002, 11822, 1301];
    }
    // else if (currentHostname.url === NEXT_PUBLIC_DOMAIN_BERACHAIN_MAINNET_PROD) {
    //     // listChainIds = [8453, 8822];
    //     listChainIds = [80094];
    // }
    const listChains = chains.filter((chain) =>
        listChainIds.includes(chain.chainId)
    );

    return (
        <>
            <button
                onClick={showModal}
                className={`flex items-center justify-between gap-2 rounded-md bg-[#1a1b1f] font-bold text-white ${isMobile ? 'btn-sm max-h-[40px] gap-1 break-words px-4 py-1 text-xs font-semibold' : 'gap-2 px-4 py-2 text-base'}`}
            >
                {chainData.name}

                <CaretDownOutlined />
            </button>
            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                className="w-[360px]"
            >
                <div className="absolute left-0 top-0 flex h-fit w-full flex-col gap-1 rounded-md bg-[#1a1b1f] p-5 text-white">
                    <p className="text-lg font-bold">Switch Networks</p>
                    {listChains.map((chain) => (
                        <button
                            key={chain.chainId}
                            onClick={() => handleChangeChain(chain)}
                            className={`flex items-center justify-between gap-2 px-1 py-2 font-bold ${chainData.chainId === chain.chainId ? 'rounded-md bg-[#7b3fe4]' : ''}`}
                        >
                            <span>{chain.name}</span>

                            {chainData.chainId === chain.chainId && (
                                <div className="flex items-center gap-1 text-sm font-semibold text-white">
                                    Selected
                                    <div className="h-2 w-2 rounded-full bg-[#30e000]"></div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </Modal>
        </>
    );
};

export default ModalSelectChain;
