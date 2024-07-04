import { getPerbaikanById } from '@/requests';
import { useStore } from '@/states';
import { useUser } from '@/utils/hooks';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';

import PerbaikanDetail from '@/components/pages/perbaikan/PerbaikanDetail';
import { Flex, Modal, notification } from 'antd';

export default function PerbaikanDetailModal({ isDone = false }) {
	const [notif, notifContext] = notification.useNotification();
	const { perbaikan, setPerbaikan } = useStore();
	const user = useUser();

	const dynamicTitle = React.useMemo(() => {
		if (user?.role === 'produksi') return 'Kerusakan';
		return 'Perbaikan';
	}, [user]);

	const isGetPerbaikanById = React.useMemo(() => {
		const { formType, selectedData } = perbaikan;
		return formType === 'show' && selectedData && !selectedData.machine;
	}, [perbaikan]);

	const perbaikanById = useQuery({
		queryKey: ['perbaikan', perbaikan?.selectedData?.id],
		queryFn: async () => {
			try {
				const { selectedData } = perbaikan;
				const data = await getPerbaikanById(selectedData?.id);
				setPerbaikan({ selectedData: data });
				return data;
			} catch (err) {
				notif.error({ message: `Gagal Mengambil Data`, description: err.message });
				throw new Error(err);
			}
		},
		enabled: !!isGetPerbaikanById,
	});

	const onCancel = () => {
		setPerbaikan({
			modalShowVisible: false,
			modalAddVisible: false,
			modalUpdateVisible: false,
			modalDeleteVisible: false,
			selectedData: null,
			formType: 'add',
		});
	};

	return (
		<Modal
			title={`Detail ${isDone ? 'Hasil ' : ' '}${dynamicTitle}`}
			open={perbaikan.modalShowVisible}
			onCancel={onCancel}
			width={500}
			footer={null}
			centered
		>
			<Flex style={{ padding: '10px 0' }} gap={20} vertical>
				<PerbaikanDetail loading={perbaikanById.isFetching} />
			</Flex>

			{notifContext}
		</Modal>
	);
}
