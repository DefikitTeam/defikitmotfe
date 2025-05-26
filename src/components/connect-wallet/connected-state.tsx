import AccountButton from './account-button';
import ChainButton from './chain-button';

// Component for connected state
const ConnectedState = ({
  chain,
  account,
  openChainModal,
  openAccountModal,
  showChainSelector,
  isMobile
}: {
  chain: any;
  account: any;
  openChainModal: () => void;
  openAccountModal: () => void;
  showChainSelector: boolean;
  isMobile: boolean;
}) => (
  <div className="flex gap-4">
    {showChainSelector && (
      <ChainButton
        chain={chain}
        openChainModal={openChainModal}
        isMobile={isMobile}
      />
    )}
    <AccountButton
      account={account}
      openAccountModal={openAccountModal}
      isMobile={isMobile}
    />
  </div>
);

export default ConnectedState;
