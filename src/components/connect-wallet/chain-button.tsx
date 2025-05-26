import { CaretDownOutlined } from '@ant-design/icons';
import ChainIcon from './chain-icon';
import ChainName from './chain-name';

const ChainButton = ({
  chain,
  openChainModal,
  isMobile
}: {
  chain: any;
  openChainModal: () => void;
  isMobile: boolean;
}) => (
  <button
    onClick={openChainModal}
    type="button"
    className={`flex items-center gap-2 rounded-md bg-[#1a1b1f] font-bold text-white ${
      isMobile
        ? 'btn-sm h-[48px] gap-1 p-2 text-xs font-semibold'
        : 'h-full gap-2 px-4 py-2 text-base'
    }`}
  >
    <ChainIcon
      chain={chain}
      isMobile={isMobile}
    />
    <ChainName
      chain={chain}
      isMobile={isMobile}
    />
    <CaretDownOutlined />
  </button>
);

export default ChainButton;
