import { useStore } from '@/states';

import { Pagination } from 'antd';

export default function MesinGridPagination({ loading, selectBox = false }) {
	const { mesin, setMesinTable } = useStore();
	const { pagination } = mesin.table;

	const onPaginate = (page, limit) => {
		setMesinTable({ pagination: { ...pagination, current: page, pageSize: limit } });
	};

	const divStyle = {
		display: 'flex',
		justifyContent: 'flex-end',
		...(selectBox ? { width: '100%' } : {}),
	};

	return (
		<div style={divStyle}>
			<Pagination
				{...pagination}
				size={selectBox ? 'small' : 'default'}
				showSizeChanger
				onChange={onPaginate}
				onShowSizeChange={onPaginate}
				disabled={loading}
			/>
		</div>
	);
}
