import { ColumnProps } from '@/components/table';
import { browseAbsensi } from '@/requests';
import { useStore } from '@/states';
import { parseTableFilter } from '@/utils/parse';
import { useQuery } from '@tanstack/react-query';

import StatusAbsensiTags from '@/components/flags/StatusAbsensiTags';
import { FileAddOutlined } from '@ant-design/icons';
import { Button, Flex, Table } from 'antd';

export default function AbsensiTable() {
	const { absensi: absensiState, setAbsensiTable, setAbsensi } = useStore();
	const { table } = absensiState;

	const absensi = useQuery({ queryKey: ['absensi', table.filter], queryFn: browseAbsensi });

	const handleTableChange = (pagination, filter) => {
		const { current: page, pageSize: limit } = pagination;
		const parsedFilter = parseTableFilter(filter);
		const filters = { page, limit, ...parsedFilter };
		setAbsensiTable({ filter: filters });
	};

	const handleSizeChange = (_curr, pageSize) => {
		setAbsensiTable({ pagination: { ...table.pagination, pageSize } });
	};

	const getColumnProps = (dataIndex) => {
		return ColumnProps({
			slice: 'absensi',
			dataIndex,
			centerFields: ['clockIn', 'clockOut', 'status'],
			dateFields: ['clockIn', 'clockOut'],
			flagFields: {
				status: {
					detail: [
						{ text: 'Hadir', value: 'present' },
						{ text: 'Cuti', value: 'leave' },
						{ text: 'Sakit', value: 'sick' },
					],
					component: <StatusAbsensiTags />,
					placeholder: 'Pilih status absensi',
				},
			},
		});
	};

	const columns = [
		{ title: 'Waktu Masuk', ...getColumnProps('clockIn'), filterDropdown: null },
		{ title: 'Waktu Keluar', ...getColumnProps('clockOut'), filterDropdown: null },
		{ title: 'Status', ...getColumnProps('status') },
	];

	const paginationOptions = {
		...table.pagination,
		showSizeChanger: true,
		pageSizeOptions: ['10', '20', '50', '100'],
		onShowSizeChange: handleSizeChange,
	};

	return (
		<Flex vertical gap={25} style={{ width: '100%', height: '100%' }}>
			<Flex>
				<Button type='primary' size='large' icon={<FileAddOutlined />} onClick={() => setAbsensi({ modalAddVisible: true })}>
					Tambah Absensi
				</Button>
			</Flex>

			<Table
				loading={absensi.isLoading}
				columns={columns}
				dataSource={absensi.data?.attendances}
				onChange={handleTableChange}
				pagination={paginationOptions}
				scroll={{ x: 'max-content' }}
				rowKey={'id'}
			/>
		</Flex>
	);
}
