export const parseNumber = (numbers) => {
	const options = { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 };
	return new Intl.NumberFormat('id-ID', options).format(numbers);
};

export const parseCurrency = (currency) => {
	const options = { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 };
	return new Intl.NumberFormat('id-ID', options).format(currency);
};
