import { useStore } from '@/states';

import { Pagination } from 'antd';

export default function TeknisiGridPagination({ loading, selectBox = false }) {
	const { teknisi, setTeknisiTable } = useStore();
	const { pagination } = teknisi.table;

	const onPaginate = (page, limit) => {
		setTeknisiTable({ pagination: { ...pagination, current: page, pageSize: limit } });
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
