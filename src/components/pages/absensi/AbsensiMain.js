'use client';

// import PerbaikanDeleteModal from '@/components/pages/perbaikan/PerbaikanDeleteModal';
// import PerbaikanDetailModal from '@/components/pages/perbaikan/PerbaikanDetailModal';
import AbsensiFormModal from '@/components/pages/absensi/AbsensiFormModal';
import AbsensiTable from '@/components/pages/absensi/AbsensiTable';
import { Flex } from 'antd';

export default function AbsensiMain() {
	return (
		<Flex vertical gap={20}>
			{/* Page Title */}
			<h2 style={{ margin: 0 }}>Absensi</h2>

			{/* Table */}
			<AbsensiTable />

			{/* Modals */}
			<AbsensiFormModal />
			{/* <PerbaikanDetailModal /> */}
			{/* <PerbaikanDeleteModal /> */}
		</Flex>
	);
}
