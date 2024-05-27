import { useStore } from '@/states';
import * as React from 'react';

import AbsensiForm from '@/components/pages/absensi/AbsensiForm';
import { Form, Modal } from 'antd';

export default function AbsensiFormModal() {
	const { absensi, setAbsensi } = useStore();
	const [form] = Form.useForm();

	const checkFormType = React.useMemo(() => {
		if (absensi.formType === 'add') return { visible: absensi.modalAddVisible, title: 'Tambah Absensi Masuk' };
		if (absensi.formType === 'update') return { visible: absensi.modalUpdateVisible, title: 'Tambah Absensi pulang' };
		return { visible: false, title: null };
	}, [absensi]);

	const onCancel = () => {
		setAbsensi({
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
		<Modal title={checkFormType.title} open={checkFormType.visible} onCancel={onCancel} width={450} footer={null} centered>
			<div style={{ paddingTop: 10 }}>
				<AbsensiForm form={form} onCancel={onCancel} />
			</div>
		</Modal>
	);
}
