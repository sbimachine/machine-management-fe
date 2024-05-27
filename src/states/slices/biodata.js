export const biodataSlice = (set) => ({
	biodata: {
		selectedData: null,
		formType: 'password',
		formImage: '',
		formImagePreview: false,
		modalPasswordVisible: false,
		modalPhotoVisible: false,
	},
	setBiodata: (newData) => set(({ biodata }) => ({ biodata: { ...biodata, ...newData } })),
});
