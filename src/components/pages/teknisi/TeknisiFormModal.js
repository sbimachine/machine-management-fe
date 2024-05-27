import { useStore } from '@/states';
import * as React from 'react';
import { useUser } from '@/utils/hooks';

import TeknisiForm from '@/components/pages/teknisi/TeknisiForm';
import { Form, Modal } from 'antd';

export default function TeknisiFormModal() {
	const { teknisi, setTeknisi } = useStore();
	const [form] = Form.useForm();
	const user = useUser();

	const checkFormType = React.useMemo(() => {
		const title = user?.role === 'supervisior' ? 'Karyawan' : 'Teknisi';
		if (teknisi.formType === 'add') return { visible: teknisi.modalAddVisible, title: `Tambah ${title}` };
		if (teknisi.formType === 'update') return { visible: teknisi.modalUpdateVisible, title: `Edit ${title}` };
		return { visible: false, title: null };
	}, [user, teknisi]);

	React.useEffect(() => {
		if (!['show', 'delete'].includes(teknisi.formType) && teknisi.selectedData) form.setFieldsValue(teknisi.selectedData);
	}, [form, teknisi]);

	const onCancel = () => {
		setTeknisi({
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
				<TeknisiForm form={form} onCancel={onCancel} />
			</div>
		</Modal>
	);
}
