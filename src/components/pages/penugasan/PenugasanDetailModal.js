import { getPerbaikanById } from '@/requests';
import { useStore } from '@/states';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';

import PenugasanDetail from '@/components/pages/penugasan/PenugasanDetail';
import { Flex, Modal, Skeleton, notification } from 'antd';

export default function PenugasanDetailModal() {
	const [notif, notifContext] = notification.useNotification();
	const { penugasan, setPenugasan } = useStore();

	const isGetPerbaikanById = React.useMemo(() => {
		const { formType, selectedData } = penugasan;
		return formType === 'show' && selectedData && !selectedData.machine;
	}, [penugasan]);

	const penugasanById = useQuery({
		queryKey: ['penugasan', penugasan?.selectedData?.id],
		queryFn: async () => {
			try {
				const { selectedData } = penugasan;
				const data = await getPerbaikanById(selectedData?.id);
				setPenugasan({ selectedData: data });
				return data;
			} catch (err) {
				notif.error({ message: `Gagal Mengambil Data`, description: err.message });
				throw new Error(err);
			}
		},
		enabled: !!isGetPerbaikanById,
	});

	const onCancel = () => {
		setPenugasan({
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
			title='Detail Laporan Perbaikan'
			open={penugasan.modalShowVisible}
			onCancel={onCancel}
			width={400}
			footer={null}
			centered
		>
			<Flex style={{ padding: '10px 0' }} gap={20} vertical>
				<Skeleton loading={penugasanById.isFetching} title={null} paragraph={{ rows: 6 }} active>
					<PenugasanDetail loading={penugasanById.isFetching} />
				</Skeleton>
			</Flex>

			{notifContext}
		</Modal>
	);
}
