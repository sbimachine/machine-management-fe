import { deleteMesin } from '@/requests';
import { useStore } from '@/states';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';

import MesinDetail from '@/components/pages/mesin/MesinDetail';
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Flex, Modal, notification } from 'antd';

export default function MesinDeleteModal() {
	const [deleteLoading, setDeleteLoading] = React.useState(false);
	const { mesin, setMesin } = useStore();
	const queryClient = useQueryClient();
	const [notif, notifContext] = notification.useNotification();

	const queryMutation = useMutation({
		mutationFn: deleteMesin,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['mesin'] });
			notif.success({ message: 'Berhasil Dihapus', description: 'Data Mesin Berhasil Dihapus' });
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
		queryMutation.mutate(mesin.selectedData?.id);
	};

	const onCancel = () => {
		setMesin({
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
			title='Hapus Mesin'
			open={mesin.modalDeleteVisible}
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
				<p style={{ margin: 0 }}>Apakah anda yakin ingin menghapus mesin ini?</p>
				<MesinDetail withImage={false} />
			</Flex>

			{notifContext}
		</Modal>
	);
}
