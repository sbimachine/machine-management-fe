import { browseTeknisiPresent } from '@/requests';
import { useStore } from '@/states';
import { parseDate } from '@/utils/parse';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { startCase } from 'lodash';
import * as React from 'react';

import TeknisiGridPagination from '@/components/pages/teknisi/TeknisiGridPagination';
import TeknisiGridSearch from '@/components/pages/teknisi/TeknisiGridSearch';
import { Divider, Flex, Form, Select, Skeleton } from 'antd';

export default function PerbaikanFormSelectTeknisi({ loading, disabled }) {
	const [selectTeknisi, setSelectTeknisi] = React.useState(false);
	const [selectedTeknisi, setSelectedTeknisi] = React.useState([]);

	const { teknisi: teknisiState, perbaikan } = useStore();
	const { filter, pagination } = teknisiState.table;

	const reshapedFilter = React.useMemo(() => {
		const { current: page, pageSize: limit } = pagination;
		const today = parseDate(dayjs(), true).format('YYYY-MM-DD');
		const fixedFilter = { role: 'teknisi', date: today };
		return { page, limit, ...fixedFilter, ...filter };
	}, [filter, pagination]);

	const teknisi = useQuery({ queryKey: ['teknisi', reshapedFilter], queryFn: browseTeknisiPresent });

	React.useEffect(() => {
		const checkStatus = teknisi.status === 'success';
		const checkFilter = Object.keys(reshapedFilter).length > 2;
		if (checkFilter && checkStatus) teknisiState.searchRef?.current?.focus();
	}, [teknisi, teknisiState, reshapedFilter]);

	React.useEffect(() => {
		if (perbaikan?.selectedData?.machine) {
			const { userId, fistName, lastName } = perbaikan.selectedData;
			setSelectedTeknisi(userId ? [{ value: userId, label: startCase(`${fistName} ${lastName}`) }] : []);
		}
	}, [perbaikan, setSelectedTeknisi]);

	const concatOptions = React.useMemo(() => {
		if (teknisi.data?.attendances.length > 0) {
			return [
				...teknisi.data?.attendances?.map((item) => ({
					value: item.user_id,
					label: startCase(`${item.firstName} ${item.lastName}`),
				})),
				...selectedTeknisi,
			];
		}
		return [];
	}, [teknisi.data, selectedTeknisi]);

	return (
		<Form.Item
			name='userId'
			label='Teknisi'
			rules={[{ required: true, message: 'Harap pilih teknisi' }]}
			validateStatus={loading ? 'validating' : ''}
			hasFeedback
		>
			<Select
				open={selectTeknisi}
				onDropdownVisibleChange={(open) => setSelectTeknisi(open)}
				placeholder='Pilih teknisi'
				dropdownRender={(options) => (
					<Flex style={{ padding: 5 }} vertical>
						<TeknisiGridSearch loading={teknisi.isFetching} selectBox />
						<Divider style={{ margin: '8px 0' }} />
						<Skeleton loading={teknisi.isFetching} title={null} paragraph={{ rows: 4 }} active>
							{options}
						</Skeleton>
						<Divider style={{ margin: '8px 0' }} />
						<TeknisiGridPagination loading={teknisi.isFetching} selectBox />
					</Flex>
				)}
				options={concatOptions}
				disabled={disabled}
				allowClear
			/>
		</Form.Item>
	);
}
