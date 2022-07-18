export const truncateString = (str?: string) => {
	if (str) {
		return str.length > 40 ? str.substring(0, 37) + '...' : str;
	}
};
