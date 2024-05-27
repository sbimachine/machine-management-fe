import { ColumnProps } from '@/components/table';
import { browseKategori, browsePerbaikan } from '@/requests';
import { useStore } from '@/states';
import { parseTableFilter } from '@/utils/parse';
import { useQueries } from '@tanstack/react-query';
import * as React from 'react';

import KategoriMesinTags from '@/components/flags/KategoriMesinTags';
import StatusPerbaikanTags from '@/components/flags/StatusPerbaikanTags';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Flex, Table } from 'antd';

export default function HasilPerbaikanTable() {
	const { perbaikan: perbaikanState, setPerbaikanTable, setPerbaikan } = useStore();
	const { table } = perbaikanState;

	const [kategori, perbaikan] = useQueries({
		queries: [
			{ queryKey: ['kategori'], queryFn: browseKategori },
			{ queryKey: ['perbaikan', table.filter], queryFn: browsePerbaikan },
		],
	});

	const handleTableChange = (pagination, filter) => {
		const { current: page, pageSize: limit } = pagination;
		const parsedFilter = parseTableFilter(filter);
		const filters = { page, limit, ...parsedFilter };
		setPerbaikanTable({ filter: filters });
	};

	const handleSizeChange = (_curr, pageSize) => {
		setPerbaikanTable({ pagination: { ...table.pagination, pageSize } });
	};

	const onSetForm = (data, type) => {
		setPerbaikan({
			formType: type,
			selectedData: data,
			modalShowVisible: type === 'show',
			modalUpdateVisible: type === 'update',
			modalDeleteVisible: type === 'delete',
		});
	};

	const getColumnProps = (dataIndex) => {
		return ColumnProps({
			slice: 'perbaikan',
			dataIndex,
			centerFields: ['categoryId', 'repairmentDate', 'status'],
			dateFields: ['repairmentDate'],
			flagFields: {
				categoryId: {
					detail: kategori.data?.map(({ id, categoryName }) => ({ text: categoryName, value: id })),
					component: <KategoriMesinTags kategoriList={kategori.data} />,
					placeholder: 'Pilih kategori mesin',
				},
				status: {
					detail: ['Indent Sparepart', 'Tidak Bisa Diperbaiki', 'Selesai Diperbaiki'].map((opt) => ({
						text: opt,
						value: opt,
					})),
					component: <StatusPerbaikanTags />,
					placeholder: 'Pilih status perbaikan',
				},
			},
		});
	};

	const columns = [
		{
			title: 'Aksi',
			key: 'aksi',
			align: 'center',
			render: (_text, data) => (
				<Flex justify='center' gap={5}>
					<Button type='primary' icon={<EyeOutlined />} onClick={() => onSetForm(data, 'show')} />
				</Flex>
			),
		},
		{ title: 'Mesin', ...getColumnProps('machineName') },
		{ title: 'Kategori', ...getColumnProps('categoryId') },
		{ title: 'Tanggal Kerusakan', ...getColumnProps('repairmentDate') },
		{ title: 'Status', ...getColumnProps('status') },
	];

	const paginationOptions = {
		...table.pagination,
		showSizeChanger: true,
		pageSizeOptions: ['10', '20', '50', '100'],
		onShowSizeChange: handleSizeChange,
	};

	const filterPerbaikan = React.useMemo(() => {
		const selectedStatus = ['Menunggu Konfirmasi', 'Proses Perbaikan'];
		return perbaikan.data?.repairments.filter(({ status }) => !selectedStatus.includes(status));
	}, [perbaikan]);

	return (
		<Flex vertical gap={25} style={{ width: '100%', height: '100%' }}>
			<Table
				loading={perbaikan.isLoading || kategori.isLoading}
				columns={columns}
				dataSource={filterPerbaikan}
				onChange={handleTableChange}
				pagination={paginationOptions}
				scroll={{ x: 'max-content' }}
				rowKey={'id'}
			/>
		</Flex>
	);
}
