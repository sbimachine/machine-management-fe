export const perbaikanSlice = (set) => ({
	perbaikan: {
		selectedData: null,
		modalAddVisible: false,
		modalShowVisible: false,
		modalUpdateVisible: false,
		modalDeleteVisible: false,
		formType: 'add',

		table: {
			filter: {},
			localFilter: {},
			inputValue: '',
			inputRef: { current: null },
			pagination: { current: 1, pageSize: 10, total: 0 },
		},
	},
	setPerbaikanTable: (newData) =>
		set(({ perbaikan }) => ({ perbaikan: { ...perbaikan, table: { ...perbaikan.table, ...newData } } })),
	setPerbaikan: (newData) => set(({ perbaikan }) => ({ perbaikan: { ...perbaikan, ...newData } })),
});
