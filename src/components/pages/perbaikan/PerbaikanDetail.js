import { useStore } from '@/states';
import { pickObject } from '@/utils/object';
import { parseDate } from '@/utils/parse';
import * as React from 'react';

import StatusPerbaikanTags from '@/components/flags/StatusPerbaikanTags';
import { Descriptions, Flex, Image, Tag, theme } from 'antd';

export default function PerbaikanDetail() {
	const { perbaikan: getPerbaikan } = useStore();
	const perbaikan = getPerbaikan.selectedData;
	const { token } = theme.useToken();

	const perbaikanItems = React.useMemo(() => {
		if (perbaikan?.machine) {
			const selectedKeys = ['userId', 'firstName', 'lastName', 'machine', 'repairmentDate', 'status', 'description'];
			const getData = pickObject(perbaikan, selectedKeys);
			const reshapedData = {
				Mesin: getData.machine.machineName,
				Kategori: <Tag>{getData.machine.category.categoryName}</Tag>,
				Status: <StatusPerbaikanTags value={getData.status} />,
				'Tanggal Kerusakan': parseDate(getData.repairmentDate, true)?.format('DD-MM-YYYY'),
				...(getData.userId ? { 'Nama Teknisi': _.startCase(`${getData.firstName} ${getData.lastName}`) } : {}),
				Keterangan: getData.description,
			};
			return Object.entries(reshapedData).map(([key, value], i) => ({ key: i + 1, label: key, children: value || '-' }));
		}
		return [];
	}, [perbaikan]);

	const imagesItems = React.useMemo(() => {
		if (perbaikan?.images?.length > 0) return perbaikan.images;
		return null;
	}, [perbaikan]);

	return (
		<Flex gap={20} vertical style={{ width: '100%' }}>
			<Descriptions items={perbaikanItems} column={1} size='middle' style={{ width: '100%' }} />
			{perbaikan?.images?.length > 0 ? (
				<Flex vertical gap={5}>
					<span style={{ fontWeight: 600, fontSize: '16px', lineHeight: 1.5 }}>Foto Laporan Perbaikan</span>
					<Image.PreviewGroup items={imagesItems.map((image) => image.imageUrl)}>
						<Image width='100%' src={imagesItems[0].imageUrl} alt='Gambar Laporan Perbaikan' />
					</Image.PreviewGroup>
					<span style={{ color: token.colorTextDescription }}>Klik untuk melihat semua gambar</span>
				</Flex>
			) : null}
		</Flex>
	);
}
