import { useStore } from '@/states';
import * as React from 'react';

import MesinForm from '@/components/pages/mesin/MesinForm';
import { Form, Modal } from 'antd';

export default function MesinFormModal() {
	const { mesin, setMesin } = useStore();
	const [form] = Form.useForm();

	const checkFormType = React.useMemo(() => {
		if (mesin.formType === 'add') return { visible: mesin.modalAddVisible, title: 'Tambah Mesin' };
		if (mesin.formType === 'update') return { visible: mesin.modalUpdateVisible, title: 'Edit Mesin' };
		return { visible: false, title: null };
	}, [mesin]);

	React.useEffect(() => {
		if (!['show', 'delete'].includes(mesin.formType) && mesin.selectedData) form.setFieldsValue(mesin.selectedData);
	}, [form, mesin]);

	const onCancel = () => {
		setMesin({
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
		<Modal title={checkFormType.title} open={checkFormType.visible} onCancel={onCancel} width={400} footer={null} centered>
			<div style={{ paddingTop: 10 }}>
				<MesinForm form={form} onCancel={onCancel} />
			</div>
		</Modal>
	);
}
