import { useStore } from '@/states';
import { api } from '@/utils/api';

export async function browsePerbaikan({ queryKey }) {
	const [_key, params] = queryKey;
	const { perbaikan, setPerbaikanTable } = useStore.getState();

	try {
		const { data } = await api.get('/repairment', { params });
		setPerbaikanTable({
			pagination: {
				...perbaikan.table.pagination,
				current: data?.data.pagination.currentPage || 1,
				total: data?.data.pagination.totalData || 0,
			},
		});
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}

export async function getPerbaikanById(id) {
	try {
		const { data } = await api.get(`/repairment/${id}`);
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}

export async function addPerbaikan(newData) {
	try {
		const { data } = await api.post('/repairment/create', newData);
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}

export async function updatePerbaikan({ id, newData }) {
	try {
		const { data } = await api.patch(`/repairment/edit/${id}`, newData);
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}

export async function assignPerbaikan({ id, newData }) {
	try {
		const { data } = await api.patch(`/repairment/assign/${id}`, newData);
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}

export async function updateStatusPerbaikan({ id, newData }) {
	try {
		const { data } = await api.patch(`/repairment/update-status/${id}`, newData);
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}

export async function deletePerbaikan(id) {
	try {
		const { data } = await api.delete(`/repairment/${id}`);
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}
