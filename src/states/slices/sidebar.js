export const sidebarSlice = (set) => ({
	sidebar: { isDrawer: false, openDrawer: false, collapsed: true },
	setSidebar: (data) => set(({ sidebar }) => ({ sidebar: { ...sidebar, ...data } })),
});
