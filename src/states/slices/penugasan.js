export const penugasanSlice = (set) => ({
	penugasan: {
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
	setPenugasanTable: (newData) =>
		set(({ penugasan }) => ({ penugasan: { ...penugasan, table: { ...penugasan.table, ...newData } } })),
	setPenugasan: (newData) => set(({ penugasan }) => ({ penugasan: { ...penugasan, ...newData } })),
});
