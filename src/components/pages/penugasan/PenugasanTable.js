import { ColumnProps } from '@/components/table';
import { browseKategori, browsePenugasan } from '@/requests';
import { useStore } from '@/states';
import { useUser } from '@/utils/hooks';
import { parseTableFilter } from '@/utils/parse';
import { useQueries } from '@tanstack/react-query';
import * as React from 'react';

import KategoriMesinTags from '@/components/flags/KategoriMesinTags';
import StatusPerbaikanTags from '@/components/flags/StatusPerbaikanTags';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Flex, Table } from 'antd';

export default function PenugasanTable() {
	const { penugasan: penugasanState, setPenugasanTable, setPenugasan } = useStore();
	const { table } = penugasanState;
	const user = useUser();

	const [kategori, penugasan] = useQueries({
		queries: [
			{ queryKey: ['kategori'], queryFn: browseKategori },
			{ queryKey: ['penugasan', { ...table.filter, userId: user?.id }], queryFn: browsePenugasan },
		],
	});

	const handleTableChange = (pagination, filter) => {
		const { current: page, pageSize: limit } = pagination;
		const parsedFilter = parseTableFilter(filter);
		const filters = { page, limit, ...parsedFilter };
		setPenugasanTable({ filter: filters });
	};

	const handleSizeChange = (_curr, pageSize) => {
		setPenugasanTable({ pagination: { ...table.pagination, pageSize } });
	};

	const onSetForm = (data, type) => {
		setPenugasan({
			formType: type,
			selectedData: data,
			modalShowVisible: type === 'show',
			modalUpdateVisible: type === 'update',
			modalDeleteVisible: type === 'delete',
		});
	};

	const getColumnProps = (dataIndex) => {
		return ColumnProps({
			slice: 'penugasan',
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
					detail: [
						'Menunggu Konfirmasi',
						'Proses Perbaikan',
						'Indent Sparepart',
						'Tidak Bisa Diperbaiki',
						'Selesai Diperbaiki',
					].map((opt) => ({ text: opt, value: opt })),
					component: <StatusPerbaikanTags />,
					placeholder: 'Pilih status penugasan',
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
					<Button
						type='primary'
						icon={<EditOutlined />}
						onClick={() => onSetForm(data, 'update')}
						disabled={data.isReported}
					/>
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
		return penugasan.data?.repairments.filter(({ status }) => status === 'Proses Perbaikan');
	}, [penugasan]);

	return (
		<Flex vertical gap={25} style={{ width: '100%', height: '100%' }}>
			<Table
				loading={penugasan.isLoading || kategori.isLoading}
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
