export const teknisiSlice = (set) => ({
	teknisi: {
		selectedData: null,
		searchRef: null,
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
	setTeknisiTable: (newData) => set(({ teknisi }) => ({ teknisi: { ...teknisi, table: { ...teknisi.table, ...newData } } })),
	setTeknisi: (newData) => set(({ teknisi }) => ({ teknisi: { ...teknisi, ...newData } })),
});
