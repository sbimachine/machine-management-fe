import { useStore } from '@/states';
import { api } from '@/utils/api';
import { getDate } from '@/utils/parse';
import dayjs from 'dayjs';

export async function browseTeknisi({ queryKey }) {
	const [_key, params] = queryKey;
	const { teknisi, setTeknisiTable } = useStore.getState();

	try {
		const { data } = await api.get('/user/browse', { params });
		setTeknisiTable({
			pagination: {
				...teknisi.table.pagination,
				current: data?.data.pagination.currentPage || 1,
				total: data?.data.pagination.totalData || 0,
			},
		});
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}

export async function browseTeknisiPresent({ queryKey }) {
	const [_key, params] = queryKey;
	const { teknisi, setTeknisiTable } = useStore.getState();

	try {
		const { data } = await api.get('/attendance/user-attendances/all', { params });
		setTeknisiTable({
			filter: {
				...teknisi.table.filter,
				role: 'teknisi',
				date: getDate.tz(dayjs(), 'America/New_York').format('YYYY-MM-DD'),
			},
			pagination: {
				...teknisi.table.pagination,
				current: data?.data.pagination.currentPage || 1,
				total: data?.data.pagination.totalData || 0,
			},
		});
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}

export async function addTeknisi(newData) {
	try {
		const { data } = await api.post('/auth/register', newData);
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}

export async function updateTeknisi({ id, newData }) {
	try {
		const { data } = await api.patch(`/user/edit/${id}`, newData);
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}

export async function deleteTeknisi(id) {
	try {
		const { data } = await api.delete(`/user/${id}`);
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}
