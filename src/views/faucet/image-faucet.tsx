const ImageFaucet = () => {
    return (
        <div className="relative">
            <div className="absolute animate-moveDiagonally">
                <img
                    src="/images/faucet.png"
                    alt="faucet"
                    style={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'contain'
                    }}
                />
            </div>
        </div>
    );
};

export default ImageFaucet;
