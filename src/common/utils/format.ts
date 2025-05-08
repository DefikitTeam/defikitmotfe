export const formatNumber = (
    num: number | string | bigint | undefined | null
): string => {
    if (num === undefined || num === null) {
        return ''; // Hoặc trả về '0' hoặc giá trị mặc định khác
    }
    // Chuyển đổi sang BigInt nếu là string hoặc number để xử lý số lớn
    try {
        const bigIntValue = BigInt(num.toString());
        // Sử dụng toLocaleString để định dạng số lớn với dấu phẩy
        return bigIntValue.toLocaleString();
    } catch (error) {
        console.error('Error formatting number:', num, error);
        return 'Invalid Number'; // Hoặc xử lý lỗi khác
    }
};
