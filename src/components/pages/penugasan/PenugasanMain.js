'use client';

import PenugasanDetailModal from '@/components/pages/penugasan/PenugasanDetailModal';
import PenugasanFormModal from '@/components/pages/penugasan/PenugasanFormModal';
import PenugasanTable from '@/components/pages/penugasan/PenugasanTable';
import { Flex } from 'antd';

export default function PenugasanMain() {
	return (
		<Flex vertical gap={20}>
			{/* Page Title */}
			<h2 style={{ margin: 0 }}>Laporan Perbaikan Mesin</h2>

			{/* Table */}
			<PenugasanTable />

			{/* Modals */}
			<PenugasanDetailModal />
			<PenugasanFormModal />
		</Flex>
	);
}
