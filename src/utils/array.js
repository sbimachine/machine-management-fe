export function distinctArray(array, key) {
	const results = new Set();
	return array.filter((item) => !results.has(item[key]) && results.add(item[key]));
}

export function countArray(array, key, value) {
	return array.reduce((count, obj) => count + (obj[key] === value ? 1 : 0), 0);
}

export function filterArray(array, filters) {
	return array.filter((item) =>
		Object.entries(filters).every(([prop, value]) => {
			if (item[prop] === null || value === null) return false;
			return item[prop].toString().toLowerCase().includes(value.toString().toLowerCase());
		})
	);
}
