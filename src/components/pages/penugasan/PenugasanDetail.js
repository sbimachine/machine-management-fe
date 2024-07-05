import { useStore } from '@/states';
import { pickObject } from '@/utils/object';
import { parseDate } from '@/utils/parse';
import { isNil, omitBy, startCase } from 'lodash';
import * as React from 'react';

import KategoriKerusakanTags from '@/components/flags/KategoriKerusakanTags';
import StatusPerbaikanTags from '@/components/flags/StatusPerbaikanTags';
import { Descriptions, Empty, Flex, Image, Skeleton, Tag, theme } from 'antd';

export default function PenugasanDetail({ loading }) {
	const { penugasan: getPenugasan } = useStore();
	const penugasan = getPenugasan.selectedData;
	const { token } = theme.useToken();

	const penugasanItems = React.useMemo(() => {
		if (penugasan?.machine) {
			const selectedKeys = [
				'userId',
				'firstName',
				'lastName',
				'machine',
				'category',
				'repairmentDate',
				'status',
				'description',
				'leaderId',
				'leaderFirstName',
				'leaderLastName',
			];
			const getData = pickObject(penugasan, selectedKeys);
			const teknisi = getData.userId ? startCase(`${getData.firstName} ${getData.lastName}`) : undefined;
			const leader = getData.leaderId ? startCase(`${getData.leaderFirstName} ${getData.leaderLastName}`) : undefined;
			const category = getData.category ? <KategoriKerusakanTags value={getData.category} /> : undefined;

			const reshapedData = {
				Mesin: getData.machine.machineName,
				Kategori: <Tag>{getData.machine.category.categoryName}</Tag>,
				Status: <StatusPerbaikanTags value={getData.status} />,
				'Tanggal Kerusakan': parseDate(getData.repairmentDate, true)?.format('DD-MM-YYYY HH:MM'),
				'Kategori Kerusakan': category,
				'Ditugaskan Oleh': leader,
				Teknisi: teknisi,
				Keterangan: getData.description,
			};
			return Object.entries(omitBy(reshapedData, isNil)).map(([key, value], i) => ({
				key: i + 1,
				label: key,
				children: value || '-',
			}));
		}
		return [];
	}, [penugasan]);

	const imagesItems = React.useMemo(() => {
		if (penugasan?.images?.length > 0) return penugasan.images;
		return null;
	}, [penugasan]);

	const reportedImagesItems = React.useMemo(() => {
		if (penugasan?.reportedImages?.length > 0) return penugasan.reportedImages;
		return null;
	}, [penugasan]);

	return (
		<Flex gap={10} vertical style={{ width: '100%' }}>
			{/* Details */}
			{!loading ? (
				<Descriptions items={penugasanItems} column={1} size='middle' style={{ width: '100%' }} />
			) : (
				<Skeleton loading={loading} title={null} paragraph={{ rows: 6 }} active />
			)}

			<Flex gap={20}>
				{/* Reported Images */}
				<Flex vertical gap={5} style={{ width: '100%' }}>
					<span style={{ fontWeight: 600, fontSize: '16px', lineHeight: 1.5 }}>Foto Laporan Kerusakan</span>
					{!loading ? (
						<>
							{reportedImagesItems?.length > 0 ? (
								<>
									<Image.PreviewGroup items={reportedImagesItems?.map((image) => image.imageUrl)}>
										<Image width='100%' src={reportedImagesItems[0]?.imageUrl} alt={`Foto Laporan Kerusakan`} />
									</Image.PreviewGroup>
									<span style={{ color: token.colorTextDescription }}>Klik untuk melihat semua gambar</span>
								</>
							) : (
								<Flex justify='center' align='center' style={{ height: '100%', paddingTop: 20, paddingBottom: 20 }}>
									<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: 0 }} description='Foto belum tersedia' />
								</Flex>
							)}
						</>
					) : (
						<Skeleton loading={loading} title={null} paragraph={{ rows: 6 }} active />
					)}
				</Flex>

				{/* Images */}
				<Flex vertical gap={5} style={{ width: '100%' }}>
					<span style={{ fontWeight: 600, fontSize: '16px', lineHeight: 1.5 }}>Foto Laporan Perbaikan</span>
					{!loading ? (
						<>
							{imagesItems?.length > 0 ? (
								<>
									<Image.PreviewGroup items={imagesItems?.map((image) => image.imageUrl)}>
										<Image width='100%' src={imagesItems[0]?.imageUrl} alt={`Foto Laporan Perbaikan`} />
									</Image.PreviewGroup>
									<span style={{ color: token.colorTextDescription }}>Klik untuk melihat semua gambar</span>
								</>
							) : (
								<Flex justify='center' align='center' style={{ height: '100%', paddingTop: 20, paddingBottom: 20 }}>
									<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: 0 }} description='Foto belum tersedia' />
								</Flex>
							)}
						</>
					) : (
						<Skeleton loading={loading} title={null} paragraph={{ rows: 6 }} active />
					)}
				</Flex>
			</Flex>
		</Flex>
	);
}
