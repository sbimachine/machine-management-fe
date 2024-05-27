export const absensiSlice = (set) => ({
	absensi: {
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
	setAbsensiTable: (newData) => set(({ absensi }) => ({ absensi: { ...absensi, table: { ...absensi.table, ...newData } } })),
	setAbsensi: (newData) => set(({ absensi }) => ({ absensi: { ...absensi, ...newData } })),
});
