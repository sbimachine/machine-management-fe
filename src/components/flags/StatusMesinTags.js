import { Tag } from 'antd';
import { capitalize } from 'lodash';

export default function StatusMesinTags({ value }) {
	const tagList = {
		ready: <Tag color='green'>{capitalize(value)}</Tag>,
		perbaikan: <Tag color='gold'>{capitalize(value)}</Tag>,
		rusak: <Tag color='red'>{capitalize(value)}</Tag>,
		default: '-',
	};

	return value ? tagList[value] : tagList.default;
}
