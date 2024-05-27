import { useStore } from '@/states';
import { api } from '@/utils/api';

export async function browseAbsensi({ queryKey }) {
	const [_key, params] = queryKey;
	const { absensi, setAbsensiTable } = useStore.getState();

	try {
		const { data } = await api.get('/attendance/user-attendances', { params });
		setAbsensiTable({
			pagination: {
				...absensi.table.pagination,
				current: data?.data.pagination.currentPage || 1,
				total: data?.data.pagination.totalData || 0,
			},
		});
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}

export async function getAbsensiCurrent() {
	try {
		const { data } = await api.get('/attendance/current');
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}

export async function addAbsensi(newData) {
	try {
		const { data } = await api.post('/attendance/create', newData);
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}
