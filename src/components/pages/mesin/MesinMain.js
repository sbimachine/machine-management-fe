'use client';

import MesinDeleteModal from '@/components/pages/mesin/MesinDeleteModal';
import MesinDetailModal from '@/components/pages/mesin/MesinDetailModal';
import MesinFormModal from '@/components/pages/mesin/MesinFormModal';
import MesinGrid from '@/components/pages/mesin/MesinGrid';
import { Flex } from 'antd';

export default function MesinMain() {
	return (
		<Flex vertical gap={20} style={{ position: 'relative', height: '100%' }}>
			{/* Page Title */}
			<h2 style={{ margin: 0 }}>Data Mesin</h2>

			{/* Grid */}
			<MesinGrid />

			{/* Modals */}
			<MesinFormModal />
			<MesinDetailModal />
			<MesinDeleteModal />
		</Flex>
	);
}
