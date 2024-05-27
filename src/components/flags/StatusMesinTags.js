import { Tag } from 'antd';
import _ from 'lodash';

export default function StatusMesinTags({ value }) {
	const tagList = {
		ready: <Tag color='green'>{_.capitalize(value)}</Tag>,
		perbaikan: <Tag color='gold'>{_.capitalize(value)}</Tag>,
		rusak: <Tag color='red'>{_.capitalize(value)}</Tag>,
		default: '-',
	};

	return value ? tagList[value] : tagList.default;
}
