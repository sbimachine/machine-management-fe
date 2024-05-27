import _ from 'lodash';

export function pickObject(obj, keys) {
	return keys.reduce((acc, curr) => {
		acc[curr] = obj[curr];
		return acc;
	}, {});
}

export function omitObject(obj, keys) {
	const result = { ...obj };
	keys.forEach((key) => {
		delete result[key];
	});
	return result;
}

export function renameObjectKeys(obj, newKeys) {
	const keyValues = Object.keys(obj).map((key) => {
		const newKey = newKeys[key] || key;
		return { [newKey]: obj[key] };
	});
	return Object.assign({}, ...keyValues);
}

export function getDiffObject(obj1, obj2) {
	return _.pickBy(obj2, (value, key) => !_.isEqual(obj1[key], value));
}
