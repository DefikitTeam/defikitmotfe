/* eslint-disable */

import { ConfigService } from '@/src/config/services/config-service';
import { useConfig } from '@/src/hooks/useConfig';
import useWindowSize from '@/src/hooks/useWindowSize';
import { IChainInfor, setChainData } from '@/src/stores/Chain/chainDataSlice';
import { CaretDownOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import dynamic from 'next/dynamic';

import { Chain } from 'viem/chains';

const ModalSelectChain = () => {
  const { isMobile } = useWindowSize();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { chainConfig, supportedChainsNew } = useConfig();

  const listChains = supportedChainsNew;

  const dispatch = useDispatch();

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChangeChain = (chain: Chain) => {
    const configService = ConfigService.getInstance();
    const newChainConfig = configService.getChainConfig(chain.id);
    const chainData = {
      chainId: chain.id,
      name: chain.name,
      currency: chain.nativeCurrency.symbol,
      explorerUrl: chain.blockExplorers?.default.url,
      rpcUrl: chain.rpcUrls.default.http[0]
    };

    setIsModalOpen(false);
    dispatch(setChainData(chainData as IChainInfor));
    const newRoute = `/${chain.name.replace(/\s+/g, '').toLowerCase()}`;

    window.location.href = newRoute;
  };

  return (
    <>
      {mounted && listChains.length > 1 && (
        <button
          onClick={showModal}
          className={`flex items-center justify-between gap-2 rounded-md bg-[#1a1b1f] font-bold text-white ${isMobile ? 'btn-sm max-h-[40px] gap-1 break-words px-4 py-1 text-xs font-semibold' : 'gap-2 px-4 py-2 text-base'}`}
        >
          {chainConfig?.name}
          <CaretDownOutlined />
        </button>
      )}
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        className="w-[360px]"
      >
        <div className="absolute left-0 top-0 flex h-fit w-full flex-col gap-1 rounded-md bg-[#1a1b1f] p-5 text-white">
          <p className="text-lg font-bold">Switch Networks</p>
          {listChains.length > 1 &&
            listChains.map((chain) => (
              <button
                key={chain.id}
                onClick={() => handleChangeChain(chain)}
                className={`flex items-center justify-between gap-2 px-1 py-2 font-bold ${chainConfig?.chainId === chain.id ? 'rounded-md bg-[#7b3fe4]' : ''}`}
              >
                <span>{chain.name}</span>

                {chainConfig?.chainId === chain.id && (
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

export default dynamic(() => Promise.resolve(ModalSelectChain), { ssr: false });
