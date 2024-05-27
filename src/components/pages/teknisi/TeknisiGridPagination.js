import { useStore } from '@/states';

import { Pagination } from 'antd';

export default function TeknisiGridPagination({ loading, selectBox = false }) {
	const { teknisi, setTeknisiTable } = useStore();
	const { pagination } = teknisi.table;

	const onPaginate = (page, limit) => {
		setTeknisiTable({ pagination: { ...pagination, current: page, pageSize: limit } });
	};

	const divStyle = !selectBox
		? { position: 'absolute', bottom: 0, right: 0 }
		: { display: 'flex', justifyContent: 'flex-end', width: '100%' };

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
