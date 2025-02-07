/* eslint-disable */

import ButtonConnectWallet from '../connect-wallet/button-connect-wallet';
const Header = () => {
    return (
        <div className="fixed z-[100] flex !w-full justify-between border-b-4 bg-header px-8 py-5">
            <ButtonConnectWallet />
        </div>
    );
};

export default Header;
