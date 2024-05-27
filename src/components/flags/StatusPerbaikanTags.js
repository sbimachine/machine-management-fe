import { Tag } from 'antd';

export default function StatusPerbaikanTags({ value }) {
	const tagList = {
		'Menunggu Konfirmasi': <Tag color='blue'>Menunggu Konfirmasi</Tag>,
		'Proses Perbaikan': <Tag color='gold'>Proses Perbaikan</Tag>,
		'Indent Sparepart': <Tag color='orange'>Indent Sparepart</Tag>,
		'Tidak Bisa Diperbaiki': <Tag color='red'>Tidak Bisa Diperbaiki</Tag>,
		'Selesai Diperbaiki': <Tag color='green'>Selesai Diperbaiki</Tag>,
		default: '-',
	};

	return value ? tagList[value] : tagList.default;
}
