import { browseKategori, browseMesin } from '@/requests';
import { useStore } from '@/states';
import { useRoleMenu } from '@/utils/hooks';
import { useQueries } from '@tanstack/react-query';
import * as React from 'react';

import MesinCard from '@/components/pages/mesin/MesinCard';
import MesinGridPagination from '@/components/pages/mesin/MesinGridPagination';
import MesinGridSearch from '@/components/pages/mesin/MesinGridSearch';
import { AppstoreAddOutlined } from '@ant-design/icons';
import { Button, Empty, Flex, Row, Skeleton } from 'antd';

export default function MesinGrid() {
	const { mesin: mesinState, setMesin } = useStore();
	const { filter, pagination } = mesinState.table;
	const { getPermission } = useRoleMenu();

	const permission = getPermission('/mesin');
	const reshapedFilter = React.useMemo(() => {
		const { current: page, pageSize: limit } = pagination;
		return { page, limit, ...filter };
	}, [filter, pagination]);

	const [kategori, mesin] = useQueries({
		queries: [
			{ queryKey: ['kategori'], queryFn: browseKategori },
			{ queryKey: ['mesin', reshapedFilter], queryFn: browseMesin },
		],
	});

	React.useEffect(() => {
		const checkStatus = mesin.status === 'success';
		const checkFilter = Object.keys(reshapedFilter).length > 2;
		if (checkFilter && checkStatus) mesinState.searchRef?.current?.focus();
	}, [mesin, mesinState, reshapedFilter]);

	return (
		<Flex vertical gap={25} style={{ width: '100%' }}>
			<Flex justify='space-between'>
				{/* Search Form */}
				<MesinGridSearch loading={mesin.isLoading || kategori.isLoading} />

				{permission?.includes('C') ? (
					<Button
						type='primary'
						size='large'
						icon={<AppstoreAddOutlined rotate='180' />}
						onClick={() => setMesin({ modalAddVisible: true })}
						disabled={mesin.isLoading || kategori.isLoading}
					>
						Tambah Mesin
					</Button>
				) : null}
			</Flex>

			{/* Cards */}
			<Flex vertical style={{ flexBasis: '100%' }}>
				<Skeleton loading={mesin.isLoading || kategori.isLoading} title={null} paragraph={{ rows: 12 }} active>
					{mesin.data?.machines?.length > 0 ? (
						<Row gutter={[16, 16]}>
							{mesin.data.machines.map((item) => (
								<MesinCard key={item.id} mesin={item} />
							))}
						</Row>
					) : (
						<Flex justify='center' align='center' style={{ height: '100%' }}>
							<Empty description='Tidak ada data' />
						</Flex>
					)}
				</Skeleton>
			</Flex>

			{/* Pagination */}
			<MesinGridPagination loading={mesin.isLoading || kategori.isLoading} />
		</Flex>
	);
}
