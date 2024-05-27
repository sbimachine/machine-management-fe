import { getPerbaikanById } from '@/requests';
import { useStore } from '@/states';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';

import PerbaikanDetail from '@/components/pages/perbaikan/PerbaikanDetail';
import { Flex, Modal, Skeleton, notification } from 'antd';

export default function PerbaikanDetailModal({ isDone = false }) {
	const [notif, notifContext] = notification.useNotification();
	const { perbaikan, setPerbaikan } = useStore();

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
			title={`Detail ${isDone ? 'Hasil ' : ' '}Laporan Perbaikan`}
			open={perbaikan.modalShowVisible}
			onCancel={onCancel}
			width={400}
			footer={null}
			centered
		>
			<Flex style={{ padding: '10px 0' }} gap={20} vertical>
				<Skeleton loading={perbaikanById.isFetching} title={null} paragraph={{ rows: 8 }} active>
					<PerbaikanDetail />
				</Skeleton>
			</Flex>

			{notifContext}
		</Modal>
	);
}
