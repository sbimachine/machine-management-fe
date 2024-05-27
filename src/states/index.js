import * as slices from '@/states/slices';
import { create } from 'zustand';

export const useStore = create()((...rest) => ({
	...slices.absensiSlice(...rest),
	...slices.biodataSlice(...rest),
	...slices.kategoriSlice(...rest),
	...slices.mesinSlice(...rest),
	...slices.penugasanSlice(...rest),
	...slices.perbaikanSlice(...rest),
	...slices.sidebarSlice(...rest),
	...slices.teknisiSlice(...rest),
}));
