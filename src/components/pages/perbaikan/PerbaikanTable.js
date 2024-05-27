import { ColumnProps } from '@/components/table';
import { browseKategori, browsePerbaikan } from '@/requests';
import { useStore } from '@/states';
import { useUser } from '@/utils/hooks';
import { parseTableFilter } from '@/utils/parse';
import { useQueries } from '@tanstack/react-query';
import * as React from 'react';

import KategoriMesinTags from '@/components/flags/KategoriMesinTags';
import StatusPerbaikanTags from '@/components/flags/StatusPerbaikanTags';
import { DeleteOutlined, EditOutlined, EyeOutlined, FileAddOutlined } from '@ant-design/icons';
import { Button, Flex, Table } from 'antd';

export default function PerbaikanTable() {
	const { perbaikan: perbaikanState, setPerbaikanTable, setPerbaikan } = useStore();
	const { table } = perbaikanState;
	const user = useUser();

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
					detail: [
						'Menunggu Konfirmasi',
						'Proses Perbaikan',
						'Indent Sparepart',
						'Tidak Bisa Diperbaiki',
						'Selesai Diperbaiki',
					].map((opt) => ({ text: opt, value: opt })),
					component: <StatusPerbaikanTags />,
					placeholder: 'Pilih status perbaikan',
				},
			},
		});
	};

	const updateBtnDisabled = React.useCallback(
		(data) => {
			if (user?.role === 'produksi') {
				return data.status !== 'Menunggu Konfirmasi';
			} else if (user?.role === 'leader') {
				if (!data.isReported && data.status === 'Proses Perbaikan') return true;
				return !['Menunggu Konfirmasi', 'Proses Perbaikan'].includes(data.status);
			} else {
				return true;
			}
		},
		[user]
	);

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
						disabled={updateBtnDisabled(data)}
					/>
					<Button
						type='primary'
						icon={<DeleteOutlined />}
						onClick={() => onSetForm(data, 'delete')}
						disabled={data.status !== 'Menunggu Konfirmasi' || ['supervisior', 'leader'].includes(user?.role)}
						danger
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
		const selectedStatus = ['Menunggu Konfirmasi', 'Proses Perbaikan'];
		return perbaikan.data?.repairments.filter(({ status }) => selectedStatus.includes(status));
	}, [perbaikan]);

	return (
		<Flex vertical gap={25} style={{ width: '100%', height: '100%' }}>
			{!['supervisior', 'leader'].includes(user?.role) ? (
				<Flex>
					<Button
						type='primary'
						size='large'
						icon={<FileAddOutlined />}
						onClick={() => setPerbaikan({ modalAddVisible: true })}
					>
						Tambah Laporan
					</Button>
				</Flex>
			) : null}

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
