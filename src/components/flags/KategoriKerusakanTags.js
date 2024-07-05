import { Tag } from 'antd';

export default function KategoriKerusakanTags({ value }) {
	const tagList = {
		Berat: <Tag color='red'>Berat</Tag>,
		Ringan: <Tag color='orange'>Ringan</Tag>,
		default: '-',
	};

	return value ? tagList[value] : tagList.default;
}
