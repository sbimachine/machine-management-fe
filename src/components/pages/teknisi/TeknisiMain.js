'use client';

import { useUser } from '@/utils/hooks';
import * as React from 'react';

import TeknisiDeleteModal from '@/components/pages/teknisi/TeknisiDeleteModal';
import TeknisiFormModal from '@/components/pages/teknisi/TeknisiFormModal';
import TeknisiGrid from '@/components/pages/teknisi/TeknisiGrid';
import TeknisiRiwayatModal from '@/components/pages/teknisi/TeknisiRiwayatModal';
import { Flex } from 'antd';

export default function TeknisiMain() {
	const user = useUser();

	const pageTitle = React.useMemo(() => {
		if (user?.role === 'supervisior') return 'Data Karyawan';
		return 'Data Teknisi';
	}, [user]);

	return (
		<Flex vertical gap={20} style={{ position: 'relative', height: '100%' }}>
			{/* Page Title */}
			<h2 style={{ margin: 0 }}>{pageTitle}</h2>

			{/* Grid */}
			<TeknisiGrid />

			{/* Modals */}
			<TeknisiFormModal />
			<TeknisiDeleteModal />
			<TeknisiRiwayatModal />
		</Flex>
	);
}
