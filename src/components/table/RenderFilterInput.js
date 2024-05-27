import { useStore } from '@/states';
import { parseDate, parseNumber } from '@/utils/parse';

import { DatePicker, Input, InputNumber, Select } from 'antd';

export default function RenderFilterInput(props) {
	const { slice, dataIndex, fieldType, filterProps, flagFields, setFilter } = props;
	const { setSelectedKeys, selectedKeys, confirm } = filterProps;

	const state = useStore();
	const table = state[slice].table;
	const { inputRef } = table;

	const onSetFilter = ({ value, isDate = false }) => {
		setFilter({ setSelectedKeys, value, key: dataIndex, isDate });
	};

	if (fieldType === 'date') {
		return (
			<DatePicker
				ref={inputRef}
				name='datePicker'
				placeholder='Pilih tanggal'
				format='DD-MM-YYYY'
				value={selectedKeys[0] ? parseDate(selectedKeys[0], true) : undefined}
				onChange={(tanggal) => onSetFilter({ value: tanggal, isDate: true })}
				style={{ width: '100%' }}
			/>
		);
	}
	if (['currency', 'numeric'].includes(fieldType)) {
		return (
			<InputNumber
				ref={inputRef}
				name='inputCurrency'
				placeholder='Cari data'
				formatter={(value) => (value.length === 0 || isNaN(value) ? '' : parseNumber(value))}
				parser={(value) => value.replace(/\./g, '')}
				value={selectedKeys[0]}
				onChange={(number) => setFilter({ value: number })}
				onPressEnter={() => confirm()}
				style={{ width: '100%' }}
			/>
		);
	}
	if (fieldType === 'flag') {
		return (
			<Select
				ref={inputRef}
				placeholder={flagFields[dataIndex]?.placeholder || 'Pilih Data'}
				value={selectedKeys[0]}
				onChange={(status) => onSetFilter({ value: status })}
				style={{ width: '100%' }}
			>
				{flagFields[dataIndex].detail.map((item, i) => (
					<Select.Option key={i + 1} value={item.value}>
						{item.text}
					</Select.Option>
				))}
			</Select>
		);
	}
	return (
		<Input
			ref={inputRef}
			name='inputText'
			placeholder='Cari data'
			value={selectedKeys[0]}
			onChange={(e) => onSetFilter({ value: e.target.value })}
			onPressEnter={() => confirm()}
			style={{ width: '100%' }}
		/>
	);
}
