import { Chain } from '@rainbow-me/rainbowkit';

export interface ChainIconProps {
    chain: Chain;
    isMobile: boolean;
}
const ChainIcon = ({ chain, isMobile }: ChainIconProps) => {
    // @ts-ignore
    if (chain.hasIcon) {
        return (
            <div
                style={{
                    background: chain.iconBackground,
                    width: 12,
                    height: 12,
                    borderRadius: 999,
                    overflow: 'hidden',
                    marginRight: 4
                }}
            >
                {chain.iconUrl && !isMobile && (
                    <img
                        alt={chain.name ?? 'Chain icon'}
                        // @ts-ignore
                        src={chain.iconUrl!}
                        style={{
                            width: 12,
                            height: 12
                        }}
                    />
                )}
            </div>
        );
    }

    // Default icon for chains without icons
    return (
        <div
            style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                overflow: 'hidden',
                marginRight: 4
            }}
        >
            <img
                alt="default chain icon"
                src="/images/logo-chain-default.png"
                style={{
                    width: 12,
                    height: 12
                }}
            />
        </div>
    );
};

export default ChainIcon;
