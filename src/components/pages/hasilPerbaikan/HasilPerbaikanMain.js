'use client';

import HasilPerbaikanTable from '@/components/pages/hasilPerbaikan/HasilPerbaikanTable';
import PerbaikanDetailModal from '@/components/pages/perbaikan/PerbaikanDetailModal';
import { Flex } from 'antd';

export default function HasilPerbaikanMain() {
	return (
		<Flex vertical gap={20}>
			{/* Page Title */}
			<h2 style={{ margin: 0 }}>Laporan Hasil Perbaikan Mesin</h2>

			{/* Table */}
			<HasilPerbaikanTable />

			{/* Modals */}
			<PerbaikanDetailModal isDone />
		</Flex>
	);
}
