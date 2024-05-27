import { deleteTeknisi } from '@/requests';
import { useStore } from '@/states';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';

import TeknisiDetail from '@/components/pages/teknisi/TeknisiDetail';
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Flex, Modal, notification } from 'antd';

export default function TeknisiDeleteModal() {
	const [deleteLoading, setDeleteLoading] = React.useState(false);

	const { teknisi, setTeknisi } = useStore();
	const queryClient = useQueryClient();
	const [notif, notifContext] = notification.useNotification();

	const queryMutation = useMutation({
		mutationFn: deleteTeknisi,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['teknisi'] });
			notif.success({ message: 'Berhasil Dihapus', description: `Data Karyawan Berhasil Dihapus` });
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
		queryMutation.mutate(teknisi.selectedData?.id);
	};

	const onCancel = () => {
		setTeknisi({
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
			title={`Hapus Karyawan`}
			open={teknisi.modalDeleteVisible}
			onOk={onDelete}
			onCancel={onCancel}
			width={400}
			footer={[
				<Button
					type='primary'
					size='large'
					icon={<DeleteOutlined />}
					onClick={onDelete}
					loading={deleteLoading}
					key='hapus'
					danger
				>
					Hapus
				</Button>,
				<Button size='large' icon={<CloseOutlined />} onClick={onCancel} key='batal' loading={deleteLoading}>
					Batal
				</Button>,
			]}
			centered
		>
			<Flex style={{ padding: '10px 0' }} gap={20} vertical>
				<p style={{ margin: 0 }}>Apakah anda yakin ingin menghapus karyawan ini?</p>
				<TeknisiDetail withImage={false} />
			</Flex>

			{notifContext}
		</Modal>
	);
}
