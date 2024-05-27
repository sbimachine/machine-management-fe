import { api } from '@/utils/api';

export async function getProfile() {
	try {
		const { data } = await api.get('/user');
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}

export async function changePassword(newData) {
	try {
		const { data } = await api.patch('/user/change-password', newData);
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}

export async function changePhoto(newData) {
	try {
		const { data } = await api.patch('/user/change-image', newData);
		return data?.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || 'Terjadi kesalahan!');
	}
}
