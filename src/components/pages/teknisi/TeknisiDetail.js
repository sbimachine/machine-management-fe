import { useStore } from '@/states';
import { pickObject } from '@/utils/object';
import _ from 'lodash';
import * as React from 'react';

import { Descriptions, Flex } from 'antd';

export default function TeknisiDetail() {
	const { teknisi: getTeknisi } = useStore();
	const teknisi = getTeknisi.selectedData;

	const teknisiItems = React.useMemo(() => {
		if (teknisi) {
			const selectedKeys = ['firstName', 'lastName', 'username', 'email', 'role'];
			const getData = pickObject(teknisi, selectedKeys);
			const reshapedData = {
				Nama: _.startCase(`${getData.firstName} ${getData.lastName}`),
				Username: getData.username,
				Email: getData.email,
				Role: _.startCase(getData.role),
			};
			return Object.entries(reshapedData).map(([key, value], i) => ({ key: i + 1, label: key, children: value || '-' }));
		}
		return [];
	}, [teknisi]);

	return (
		<Flex gap={20} vertical>
			<Flex>
				<Descriptions items={teknisiItems} column={1} size='middle' style={{ width: '100%' }} />
			</Flex>
		</Flex>
	);
}
