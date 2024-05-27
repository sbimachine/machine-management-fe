export const mesinSlice = (set) => ({
	mesin: {
		kategori: [],
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
	setMesinTable: (newData) => set(({ mesin }) => ({ mesin: { ...mesin, table: { ...mesin.table, ...newData } } })),
	setMesin: (newData) => set(({ mesin }) => ({ mesin: { ...mesin, ...newData } })),
});
