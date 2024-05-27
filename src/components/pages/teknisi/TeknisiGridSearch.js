import { useStore } from '@/states';
import _ from 'lodash';
import * as React from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Input, Select, Space } from 'antd';

export default function TeknisiGridSearch({ loading, selectBox = false }) {
	const localSearchRef = React.useRef(null);

	const { teknisi, setTeknisi, setTeknisiTable } = useStore();
	const { filter, localFilter } = teknisi.table;

	const debounceFilter = React.useMemo(
		() => _.debounce(({ key, value }) => setTeknisiTable({ filter: { ...filter, [key]: value } }), 500),
		[filter, setTeknisiTable]
	);

	React.useEffect(() => {
		if (localSearchRef?.current) setTeknisi({ searchRef: localSearchRef });
	}, [setTeknisi]);

	React.useEffect(() => {
		return () => debounceFilter.cancel();
	}, [debounceFilter]);

	const onResetFilter = (key) => {
		const getFilter = { ...filter };
		delete getFilter[key];
		setTeknisiTable({ filter: getFilter, localFilter: getFilter });
	};

	const onSearch = (key, value) => {
		if (value?.length < 1 || value === undefined) {
			onResetFilter(key);
		} else {
			setTeknisiTable({ localFilter: { ...localFilter, [key]: value } });
			debounceFilter({ key, value });
		}
	};

	return (
		<Space.Compact style={{ width: !selectBox ? 'auto' : '100%' }}>
			<Input
				ref={localSearchRef}
				size={!selectBox ? 'large' : undefined}
				placeholder='Cari Teknisi'
				prefix={<SearchOutlined />}
				style={{ width: !selectBox ? 250 : '100%' }}
				value={localFilter?.name || ''}
				onChange={(e) => onSearch('name', e.target.value)}
				onKeyDown={(e) => e.stopPropagation()}
				disabled={loading}
				allowClear
			/>
			{!selectBox ? (
				<Select
					size='large'
					placeholder='Urutkan'
					style={{ width: 150 }}
					value={localFilter?.sort || undefined}
					onChange={(val) => onSearch('sort', val)}
					options={[
						{ value: 'firstName', label: 'Nama Depan' },
						{ value: 'lastName', label: 'Nama Belakang' },
						{ value: 'role', label: 'Jabatan' },
					]}
					disabled={loading}
					allowClear
				/>
			) : null}
		</Space.Compact>
	);
}
