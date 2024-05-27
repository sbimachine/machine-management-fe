import { deletePerbaikan, getPerbaikanById } from '@/requests';
import { useStore } from '@/states';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';

import PerbaikanDetail from '@/components/pages/perbaikan/PerbaikanDetail';
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Flex, Modal, Skeleton, notification } from 'antd';

export default function PerbaikanDeleteModal() {
	const [deleteLoading, setDeleteLoading] = React.useState(false);

	const [notif, notifContext] = notification.useNotification();
	const { perbaikan, setPerbaikan } = useStore();
	const queryClient = useQueryClient();

	const isGetPerbaikanById = React.useMemo(() => {
		const { formType, selectedData } = perbaikan;
		return formType === 'delete' && selectedData && !selectedData.machine;
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

	const queryMutation = useMutation({
		mutationFn: deletePerbaikan,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['perbaikan'] });
			notif.success({ message: 'Berhasil Dihapus', description: 'Data Laporan Perbaikan Berhasil Dihapus' });
			setDeleteLoading(false);
			onCancel();
		},
		onError: (err) => {
			notif.error({ message: 'Gagal Dihapus', description: err.message });
			setDeleteLoading(false);
		},
	});

	const onDelete = () => {
		setDeleteLoading(true);
		queryMutation.mutate(perbaikan?.selectedData?.id);
	};

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
			title='Hapus Laporan Perbaikan'
			open={perbaikan.modalDeleteVisible}
			onOk={onDelete}
			onCancel={onCancel}
			width={400}
			footer={[
				<Button
					type='primary'
					size='large'
					icon={<DeleteOutlined />}
					onClick={onDelete}
					loading={deleteLoading || perbaikanById.isFetching}
					key='hapus'
					danger
				>
					Hapus
				</Button>,
				<Button
					size='large'
					icon={<CloseOutlined />}
					onClick={onCancel}
					key='batal'
					loading={deleteLoading || perbaikanById.isFetching}
				>
					Batal
				</Button>,
			]}
			centered
		>
			<Flex style={{ padding: '10px 0' }} gap={20} vertical>
				<Skeleton loading={perbaikanById.isFetching} title={null} paragraph={{ rows: 8 }} active>
					<p style={{ margin: 0 }}>Apakah anda yakin ingin menghapus laporan perbaikan ini?</p>
					<PerbaikanDetail />
				</Skeleton>
			</Flex>

			{notifContext}
		</Modal>
	);
}
