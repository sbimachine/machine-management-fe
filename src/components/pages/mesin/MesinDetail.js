import { useStore } from '@/states';
import { pickObject } from '@/utils/object';
import { parseDate } from '@/utils/parse';
import * as React from 'react';

import StatusMesinTags from '@/components/flags/StatusMesinTags';
import { Descriptions, Flex, Image, Tag, theme } from 'antd';

export default function MesinDetail({ withImage = true }) {
	const { mesin: getMesin } = useStore();
	const mesin = getMesin.selectedData;
	const { token } = theme.useToken();

	const mesinItems = React.useMemo(() => {
		if (mesin) {
			const selectedKeys = ['machineName', 'categoryName', 'buyDate', 'status', 'description'];
			const getData = pickObject(mesin, selectedKeys);
			const reshapedData = {
				Nama: getData.machineName,
				Kategori: <Tag>{getData.categoryName}</Tag>,
				Status: <StatusMesinTags value={getData.status} />,
				Tanggal: parseDate(getData.buyDate, true).format('DD-MM-YYYY'),
				Keterangan: getData.description,
			};
			return Object.entries(reshapedData).map(([key, value], i) => ({ key: i + 1, label: key, children: value || '-' }));
		}
		return [];
	}, [mesin]);

	return (
		<Flex gap={20} vertical>
			{withImage ? (
				<Flex vertical>
					<p style={{ margin: '0 0 8px 0', color: token.colorTextDescription }}>Gambar: </p>
					{mesin?.imageUrl ? <Image src={mesin?.imageUrl} alt='Gambar Mesin' /> : null}
				</Flex>
			) : null}
			<Flex>
				<Descriptions items={mesinItems} column={1} size='middle' style={{ width: '100%' }} />
			</Flex>
		</Flex>
	);
}
