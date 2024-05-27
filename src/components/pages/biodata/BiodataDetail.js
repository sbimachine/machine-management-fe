'use client';

import { getProfile } from '@/requests';
import { useStore } from '@/states';
import { pickObject } from '@/utils/object';
import { parseFormFile } from '@/utils/parse';
import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import * as React from 'react';

import BiodataPasswordModal from '@/components/pages/biodata/BiodataPasswordModal';
import BiodataPhotoModal from '@/components/pages/biodata/BiodataPhotoModal';
import { FileImageOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Avatar, Button, Descriptions, Flex, Grid, notification, Skeleton } from 'antd';

export default function BiodataDetail() {
	const [notif, notifContext] = notification.useNotification();
	const { biodata, setBiodata } = useStore();
	const { sm, md, lg } = Grid.useBreakpoint();

	const getBiodata = useQuery({
		queryKey: ['biodata'],
		queryFn: async () => {
			try {
				const data = await getProfile();
				setBiodata({ selectedData: data });
				return data;
			} catch (err) {
				notif.error({ message: `Gagal Mengambil Data`, description: err.message });
				throw new Error(err);
			}
		},
	});

	const biodataItems = React.useMemo(() => {
		if (biodata?.selectedData) {
			const { selectedData } = biodata;
			const selectedKeys = ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'address', 'role'];
			const getData = pickObject(selectedData, selectedKeys);

			const reshapedData = {
				'Nama Lengkap': _.startCase(`${getData.firstName} ${getData.lastName}`),
				Email: getData.email,
				'Nomor Telepon': getData.phone,
				'Tanggal Lahir': getData.birthDate,
				Alamat: getData.address,
				Jabatan: _.capitalize(getData.role),
			};

			return Object.entries(reshapedData).map(([key, value], i) => ({
				key: i + 1,
				label: key,
				children: value || '-',
			}));
		}
		return [];
	}, [biodata]);

	const onSetData = () => {
		if (biodata.selectedData?.imageUrl) {
			const { imageUrl, firstName, lastName } = biodata.selectedData;
			const parsedData = parseFormFile({ image: { urls: [imageUrl], filename: `Foto ${firstName} ${lastName}` } });
			setBiodata({
				formType: 'photo',
				modalPhotoVisible: true,
				selectedData: { ...biodata.selectedData, ...parsedData },
			});
		} else {
			setBiodata({
				formType: 'photo',
				modalPhotoVisible: true,
				selectedData: biodata.selectedData,
			});
		}
	};

	return (
		<Flex gap={20} vertical>
			<Flex justify='center' gap={35} vertical={!md}>
				<Flex justify='center' align='center' style={{ width: md ? 200 : '100%' }} vertical gap={15}>
					<Avatar size={200} shape='circle' src={biodata?.selectedData?.imageUrl} />
					<Button icon={<FileImageOutlined />} block={!sm} onClick={onSetData} disabled={getBiodata.isLoading}>
						Ubah Foto
					</Button>
				</Flex>
				<Flex style={{ width: '100%' }}>
					<Skeleton loading={getBiodata.isLoading} title={null} paragraph={{ rows: 8 }} active>
						<Descriptions
							items={biodataItems}
							column={1}
							size='middle'
							style={{ width: '100%' }}
							labelStyle={{ width: lg ? 200 : 'inherit' }}
							bordered
						/>
					</Skeleton>
				</Flex>
			</Flex>
			<Flex justify='flex-end'>
				<Button
					type='primary'
					icon={<QrcodeOutlined />}
					block={!sm}
					onClick={() => setBiodata({ modalPasswordVisible: true })}
					disabled={getBiodata.isLoading}
				>
					Ubah Password
				</Button>
			</Flex>

			{notifContext}

			{/* Modals */}
			<BiodataPhotoModal />
			<BiodataPasswordModal />
		</Flex>
	);
}
