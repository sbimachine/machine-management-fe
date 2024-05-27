import { parseDate } from '@/utils/parse';

export const parseFormData = (data, groupFields = {}) => {
	return Object.fromEntries(
		Object.entries(
			Object.keys(data).reduce((previous, current) => {
				if (groupFields.hasOwnProperty('datePicker') && groupFields['datePicker']?.includes(current)) {
					return { ...previous, [current]: data[current] ? parseDate(data[current]) : null };
				}
				if (groupFields.hasOwnProperty('rangePicker') && groupFields['rangePicker']?.includes(current)) {
					const [startDate, endDate] = data[current];
					const checkStartDate = startDate ? parseDate(startDate) : null;
					const checkEndDate = endDate ? parseDate(endDate) : null;
					const rangeDateValue = [checkStartDate, checkEndDate];
					return { ...previous, [current]: rangeDateValue };
				}
				if (groupFields.hasOwnProperty('file') && groupFields['file']?.includes(current)) {
					const fileValue = Array.isArray(data[current]) && data[current].length > 0 ? data[current][0].originFileObj : null;
					return { ...previous, [current]: fileValue };
				}
				if (groupFields.hasOwnProperty('multipleFile') && groupFields['multipleFile']?.includes(current)) {
					const fileValue =
						Array.isArray(data[current]) && data[current].length > 0
							? data[current].map(({ originFileObj }) => originFileObj)
							: null;
					return { ...previous, [current]: fileValue };
				}
				return { ...previous, [current]: data[current] };
			}, {})
		).filter(([_, value]) => !(value === null || value === undefined))
	);
};

export const parseFormFile = (files) => {
	return Object.keys(files).reduce((acc, curr) => {
		return {
			...acc,
			[curr]: files[curr].urls
				? files[curr].urls.map((url, i) => {
						const { filename } = files[curr];
						const fullname = url.split('/').pop().split('.');
						return { uid: fullname[0], status: 'done', name: `Gambar ${filename || 'Mesin'}.${fullname[1]}`, url };
					})
				: null,
		};
	}, {});
};
