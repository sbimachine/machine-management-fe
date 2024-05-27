export const kategoriSlice = (set) => ({
	kategori: { kategori: [] },
	setKategori: (newData) => set(({ kategori }) => ({ kategori: { ...kategori, ...newData } })),
});
