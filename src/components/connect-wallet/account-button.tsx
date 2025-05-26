import { CaretDownOutlined } from '@ant-design/icons';

const AccountButton = ({
  account,
  openAccountModal,
  isMobile
}: {
  account: any;
  openAccountModal: () => void;
  isMobile: boolean;
}) => (
  <button
    onClick={openAccountModal}
    type="button"
    className={`flex h-fit items-center overflow-hidden rounded-md bg-[#1a1b1f] font-bold text-white ${
      isMobile ? 'btn-sm gap-1 p-0 text-xs font-semibold' : 'gap-2 text-base'
    }`}
  >
    <div className={`${isMobile ? 'hidden' : 'px-4 py-2'}`}>
      {account.displayBalance ?? ''}
    </div>
    <div className="flex h-full items-center gap-2 bg-[#2f3033] px-4 py-2">
      {account.displayName}
      <CaretDownOutlined />
    </div>
  </button>
);

export default AccountButton;
