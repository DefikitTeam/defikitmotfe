export const TRUNCATED_NAME_CHAR_LIMIT = 11;
export const TRUNCATED_ADDRESS_START_CHARS = 5;
export const TRUNCATED_ADDRESS_END_CHARS = 4;

export function shortenAddress(
    address = '',
    from = TRUNCATED_ADDRESS_START_CHARS,
    to = TRUNCATED_ADDRESS_END_CHARS
) {
    if (address?.length < TRUNCATED_NAME_CHAR_LIMIT) {
        return address;
    }

    return `${address.slice(0, from)}...${address.slice(-to)}`;
}
