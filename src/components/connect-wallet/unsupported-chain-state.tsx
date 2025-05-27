// Component for unsupported chain state
const UnsupportedChainState = ({
  openChainModal
}: {
  openChainModal: () => void;
}) => (
  <button
    onClick={openChainModal}
    className="rounded-md bg-[#ff494a] px-4 py-2 font-bold text-white"
  >
    Wrong network
  </button>
);

export default UnsupportedChainState;
