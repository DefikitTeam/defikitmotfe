import ModalSelectChain from '../ui/ModalSelectChain';

// Component for disconnected state
const DisconnectedState = ({
  showChainSelector,
  openConnectModal,
  isMobile
}: {
  showChainSelector: boolean;
  openConnectModal: () => void;
  isMobile: boolean;
}) => (
  <>
    {showChainSelector && <ModalSelectChain />}
    <button
      onClick={openConnectModal}
      type="button"
      className={`rounded-md bg-[#7b3fe4] font-bold text-white ${
        isMobile
          ? 'btn-sm gap-1 px-2 py-1 text-xs font-semibold'
          : 'gap-2 px-4 py-2 text-base'
      }`}
    >
      Connect Wallet
    </button>
  </>
);

export default DisconnectedState;
