import { Chain } from '@rainbow-me/rainbowkit';

interface ChainNameProps {
    chain: Chain;
    isMobile: boolean;
}

const ChainName = ({ chain, isMobile }: ChainNameProps) => {
    if (isMobile && chain?.name && chain.name.length > 10) {
        return (
            <p className="text-sm font-semibold">{chain.name.slice(0, 8)}...</p>
        );
    }

    return <p className="text-base font-semibold">{chain.name}</p>;
};

export default ChainName;
