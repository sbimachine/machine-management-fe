import { useStore } from '@/states';
import { useUser } from '@/utils/hooks';
import { pickObject } from '@/utils/object';
import { parseDate } from '@/utils/parse';
import { startCase } from 'lodash';
import * as React from 'react';

import StatusPerbaikanTags from '@/components/flags/StatusPerbaikanTags';
import { Descriptions, Empty, Flex, Image, Skeleton, Tag, theme } from 'antd';

export default function PerbaikanDetail({ loading, type = 'detail' }) {
	const { perbaikan: getPerbaikan } = useStore();
	const perbaikan = getPerbaikan.selectedData;
	const { token } = theme.useToken();
	const user = useUser();

	const perbaikanItems = React.useMemo(() => {
		if (perbaikan?.machine) {
			const selectedKeys = ['userId', 'firstName', 'lastName', 'machine', 'repairmentDate', 'status', 'description'];
			const getData = pickObject(perbaikan, selectedKeys);
			const reshapedData = {
				Mesin: getData.machine.machineName,
				Kategori: <Tag>{getData.machine.category.categoryName}</Tag>,
				Status: <StatusPerbaikanTags value={getData.status} />,
				'Tanggal Kerusakan': parseDate(getData.repairmentDate, true)?.format('DD-MM-YYYY'),
				...(getData.userId ? { 'Nama Teknisi': startCase(`${getData.firstName} ${getData.lastName}`) } : {}),
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

	const reportedImagesItems = React.useMemo(() => {
		if (perbaikan?.reportedImages?.length > 0) return perbaikan.reportedImages;
		return null;
	}, [perbaikan]);

	return (
		<Flex gap={10} vertical style={{ width: '100%' }}>
			{/* Details */}
			{!loading ? (
				<Descriptions items={perbaikanItems} column={1} size='middle' style={{ width: '100%' }} />
			) : (
				<Skeleton loading={loading} title={null} paragraph={{ rows: 6 }} active />
			)}

			{type === 'detail' ? (
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
					{['leader', 'supervisior'].includes(user?.role) ? (
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
					) : null}
				</Flex>
			) : null}
		</Flex>
	);
}
