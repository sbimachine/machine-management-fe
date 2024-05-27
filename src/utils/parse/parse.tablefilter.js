export const parseTableFilter = (data) => {
	return Object.keys(data).reduce((previous, current) => {
		const isUndefined = data[current]?.toString().length > 0 ? { [current]: data[current][0] } : {};
		return { ...previous, ...isUndefined };
	}, {});
};
