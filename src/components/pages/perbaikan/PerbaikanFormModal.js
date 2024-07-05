import { useStore } from '@/states';
import { useUser } from '@/utils/hooks';
import * as React from 'react';

import PerbaikanForm from '@/components/pages/perbaikan/PerbaikanForm';
import { Form, Modal } from 'antd';

export default function PerbaikanFormModal() {
	const { perbaikan, setPerbaikan } = useStore();
	const [form] = Form.useForm();
	const user = useUser();

	const dynamicTitle = React.useMemo(() => {
		if (user?.role === 'produksi') return 'Kerusakan';
		return 'Perbaikan';
	}, [user]);

	const checkFormType = React.useMemo(() => {
		if (perbaikan.formType === 'add') {
			return { visible: perbaikan.modalAddVisible, title: `Tambah Laporan ${dynamicTitle}` };
		}
		if (perbaikan.formType === 'update') {
			const msg =
				user?.role === 'leader' ? (perbaikan?.selectedData?.userId ? 'Perbarui Status' : 'Tugaskan') : 'Edit Laporan';
			return { visible: perbaikan.modalUpdateVisible, title: `${msg} ${dynamicTitle}` };
		}
		return { visible: false, title: null };
	}, [dynamicTitle, perbaikan, user]);

	const onCancel = () => {
		setPerbaikan({
			modalShowVisible: false,
			modalAddVisible: false,
			modalUpdateVisible: false,
			modalDeleteVisible: false,
			selectedData: null,
			formType: 'add',
		});
		form.resetFields();
	};

	return (
		<Modal title={checkFormType.title} open={checkFormType.visible} onCancel={onCancel} width={500} footer={null} centered>
			<div style={{ paddingTop: 10 }}>
				<PerbaikanForm form={form} onCancel={onCancel} dynamicTitle={dynamicTitle} />
			</div>
		</Modal>
	);
}
