import mimeTypes from '@/mime-types';

export const getMimeTypes = (type) => {
	if (typeof type === 'string') {
		const keys = Object.keys(mimeTypes[type]);
		const values = Object.values(mimeTypes[type]);
		return [...new Set([...keys, ...values])].join(',');
	}
	return null;
};
