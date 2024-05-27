import { useStore } from '@/states';

import BiodataPasswordForm from '@/components/pages/biodata/BiodataPasswordForm';
import { Form, Modal } from 'antd';

export default function BiodataPasswordModal() {
	const { biodata, setBiodata } = useStore();
	const [form] = Form.useForm();

	const onCancel = () => {
		form.resetFields();
		setBiodata({
			formType: 'password',
			modalPasswordVisible: false,
			modalPhotoVisible: false,
		});
	};

	return (
		<Modal title='Ubah Password' open={biodata.modalPasswordVisible} onCancel={onCancel} width={400} footer={null} centered>
			<div style={{ paddingTop: 10 }}>
				<BiodataPasswordForm form={form} onCancel={onCancel} />
			</div>
		</Modal>
	);
}
