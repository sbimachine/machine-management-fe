import { useStore } from '@/states';
import _ from 'lodash';
import * as React from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Input, Select, Space } from 'antd';

export default function MesinGridSearch({ loading, selectBox = false }) {
	const localSearchRef = React.useRef(null);

	const { mesin, kategori: getKategori, setMesin, setMesinTable } = useStore();
	const { filter, localFilter } = mesin.table;
	const { kategori } = getKategori;

	const debounceFilter = React.useMemo(
		() => _.debounce(({ key, value }) => setMesinTable({ filter: { ...filter, [key]: value } }), 500),
		[filter, setMesinTable]
	);

	React.useEffect(() => {
		if (localSearchRef?.current) setMesin({ searchRef: localSearchRef });
	}, [setMesin]);

	React.useEffect(() => {
		return () => debounceFilter.cancel();
	}, [debounceFilter]);

	const onResetFilter = (key) => {
		const getFilter = { ...filter };
		delete getFilter[key];
		setMesinTable({ filter: getFilter, localFilter: getFilter });
	};

	const onSearch = (key, value) => {
		if (value?.length < 1 || value === undefined) {
			onResetFilter(key);
		} else {
			setMesinTable({ localFilter: { ...localFilter, [key]: value } });
			debounceFilter({ key, value });
		}
	};

	return (
		<Space.Compact style={{ width: !selectBox ? 'auto' : '100%' }}>
			<Input
				ref={localSearchRef}
				size={!selectBox ? 'large' : undefined}
				placeholder='Cari Mesin'
				prefix={<SearchOutlined />}
				style={{ width: !selectBox ? 250 : '100%' }}
				value={localFilter?.machineName || ''}
				onChange={(e) => onSearch('machineName', e.target.value)}
				onKeyDown={(e) => e.stopPropagation()}
				disabled={loading}
				allowClear
			/>
			{!selectBox ? (
				<>
					<Select
						size='large'
						placeholder='Pilih Kategori'
						style={{ width: 150 }}
						value={localFilter?.categoryId || undefined}
						onChange={(val) => onSearch('categoryId', val)}
						options={kategori?.map((item) => ({ value: item.id, label: item.categoryName }))}
						disabled={loading}
						allowClear
					/>
					<Select
						size='large'
						placeholder='Urutkan'
						style={{ width: 150 }}
						value={localFilter?.sort || undefined}
						onChange={(val) => onSearch('sort', val)}
						options={[
							{ value: 'newest', label: 'Terbaru' },
							{ value: 'oldest', label: 'Terlama' },
							{ value: 'category', label: 'Kategori' },
						]}
						disabled={loading}
						allowClear
					/>
				</>
			) : null}
		</Space.Compact>
	);
}
