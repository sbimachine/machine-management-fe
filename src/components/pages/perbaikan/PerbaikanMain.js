'use client';

import PerbaikanDeleteModal from '@/components/pages/perbaikan/PerbaikanDeleteModal';
import PerbaikanDetailModal from '@/components/pages/perbaikan/PerbaikanDetailModal';
import PerbaikanFormModal from '@/components/pages/perbaikan/PerbaikanFormModal';
import PerbaikanTable from '@/components/pages/perbaikan/PerbaikanTable';
import { useUser } from '@/utils/hooks';
import { Flex } from 'antd';
import * as React from 'react';

export default function PerbaikanMain() {
	const user = useUser();

	const dynamicTitle = React.useMemo(() => {
		if (user?.role === 'produksi') return 'Laporan Kerusakan Mesin';
		return 'Laporan Perbaikan Mesin';
	}, [user]);

	return (
		<Flex vertical gap={20}>
			{/* Page Title */}
			<h2 style={{ margin: 0 }}>{dynamicTitle}</h2>

			{/* Table */}
			<PerbaikanTable />

			{/* Modals */}
			<PerbaikanFormModal />
			<PerbaikanDetailModal />
			<PerbaikanDeleteModal />
		</Flex>
	);
}
