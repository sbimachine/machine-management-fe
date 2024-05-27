'use client';

import PerbaikanDeleteModal from '@/components/pages/perbaikan/PerbaikanDeleteModal';
import PerbaikanDetailModal from '@/components/pages/perbaikan/PerbaikanDetailModal';
import PerbaikanFormModal from '@/components/pages/perbaikan/PerbaikanFormModal';
import PerbaikanTable from '@/components/pages/perbaikan/PerbaikanTable';
import { Flex } from 'antd';

export default function PerbaikanMain() {
	return (
		<Flex vertical gap={20}>
			{/* Page Title */}
			<h2 style={{ margin: 0 }}>Laporan Perbaikan Mesin</h2>

			{/* Table */}
			<PerbaikanTable />

			{/* Modals */}
			<PerbaikanFormModal />
			<PerbaikanDetailModal />
			<PerbaikanDeleteModal />
		</Flex>
	);
}
