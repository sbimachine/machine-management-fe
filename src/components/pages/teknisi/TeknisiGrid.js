import { browseTeknisi } from '@/requests';
import { useStore } from '@/states';
import { useRoleMenu, useUser } from '@/utils/hooks';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';

import TeknisiCard from '@/components/pages/teknisi/TeknisiCard';
import TeknisiGridPagination from '@/components/pages/teknisi/TeknisiGridPagination';
import TeknisiGridSearch from '@/components/pages/teknisi/TeknisiGridSearch';
import { UserAddOutlined } from '@ant-design/icons';
import { Button, Flex, List, Skeleton } from 'antd';

export default function TeknisiGrid() {
	const { teknisi: teknisiState, setTeknisi } = useStore();
	const { filter, pagination } = teknisiState.table;
	const { getPermission } = useRoleMenu();
	const user = useUser();

	const permission = getPermission('/teknisi');
	const reshapedFilter = React.useMemo(() => {
		const { current: page, pageSize: limit } = pagination;
		const role = user?.role !== 'supervisior' ? { role: 'teknisi' } : {};
		return { page, limit, ...filter, ...role };
	}, [user, filter, pagination]);

	const teknisi = useQuery({ queryKey: ['teknisi', reshapedFilter], queryFn: browseTeknisi });
	const btnAddText = React.useMemo(() => (user?.role === 'supervisior' ? 'Karyawan' : 'Teknisi'), [user]);

	React.useEffect(() => {
		const checkStatus = teknisi.status === 'success';
		const checkFilter = Object.keys(reshapedFilter).length > 2;
		if (checkFilter && checkStatus) teknisiState.searchRef?.current?.focus();
	}, [teknisi, teknisiState, reshapedFilter]);

	return (
		<Flex vertical gap={25} style={{ width: '100%', height: '100%' }}>
			<Flex justify='space-between'>
				{/* Search Form */}
				<TeknisiGridSearch loading={teknisi.isLoading} />

				{/* Add Button */}
				{permission?.includes('C') ? (
					<Button
						type='primary'
						size='large'
						icon={<UserAddOutlined />}
						onClick={() => setTeknisi({ modalAddVisible: true })}
						disabled={teknisi.isLoading}
					>
						Tambah {btnAddText}
					</Button>
				) : null}
			</Flex>

			{/* Grid */}
			<Skeleton loading={teknisi.isLoading} title={null} paragraph={{ rows: 12 }} active>
				{teknisi.data?.users?.length > 0 ? (
					<List
						size='large'
						itemLayout='horizontal'
						dataSource={teknisi.data.users}
						renderItem={(item, i) => <TeknisiCard item={item} key={i} />}
					/>
				) : null}
			</Skeleton>

			{/* Pagination */}
			<TeknisiGridPagination loading={teknisi.isLoading} />
		</Flex>
	);
}
