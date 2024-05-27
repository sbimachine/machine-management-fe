import { useStore } from '@/states';
import { api } from '@/utils/api';

export async function browsePenugasan({ queryKey }) {
	const [_key, params] = queryKey;
	const { penugasan, setPenugasanTable } = useStore.getState();

	try {
		const { userId } = params;
		const { data } = await api.get(`/repairment`, { params });
		setPenugasanTable({
			filter: { ...penugasan.table.filter, userId },
			pagination: {
				...penugasan.table.pagination,
				current: data?.data.pagination.currentPage || 1,
				total: data?.data.pagination.totalData || 0,
			},
		});
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}

export async function reportPenugasan({ id, newData }) {
	try {
		const { data } = await api.patch(`/repairment/report/${id}`, newData);
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}
