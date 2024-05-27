import { useStore } from '@/states';
import * as React from 'react';

import PenugasanForm from '@/components/pages/penugasan/PenugasanForm';
import { Form, Modal } from 'antd';

export default function PenugasanFormModal() {
	const { penugasan, setPenugasan } = useStore();
	const [form] = Form.useForm();

	const checkFormType = React.useMemo(() => {
		return { visible: penugasan.modalUpdateVisible, title: 'Laporkan Perbaikan' };
	}, [penugasan]);

	const onCancel = () => {
		setPenugasan({
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
				<PenugasanForm form={form} onCancel={onCancel} />
			</div>
		</Modal>
	);
}
