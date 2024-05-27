import { useStore } from '@/states';
import { api } from '@/utils/api';

export async function browseMesin({ queryKey }) {
	const [_key, params] = queryKey;
	const { mesin, setMesinTable } = useStore.getState();

	try {
		const { data } = await api.get('/machine/all', { params });
		setMesinTable({
			pagination: {
				...mesin.table.pagination,
				current: data?.data.pagination.currentPage || 1,
				total: data?.data.pagination.totalData || 0,
			},
		});
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}

export async function addMesin(newData) {
	try {
		const { data } = await api.post('/machine/create', newData);
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}

export async function updateMesin({ id, newData }) {
	try {
		const { data } = await api.patch(`/machine/edit/${id}`, newData);
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}

export async function deleteMesin(id) {
	try {
		const { data } = await api.delete(`/machine/${id}`);
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}
