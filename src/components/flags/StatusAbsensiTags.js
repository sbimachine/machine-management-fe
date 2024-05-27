import { Tag } from 'antd';

export default function StatusAbsensiTags({ value }) {
	const tagList = {
		present: <Tag color='green'>Hadir</Tag>,
		leave: <Tag color='orange'>Cuti</Tag>,
		sick: <Tag color='red'>Sakit</Tag>,
		default: '-',
	};

	return value ? tagList[value] : tagList.default;
}
