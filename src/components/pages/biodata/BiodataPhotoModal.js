import { useStore } from '@/states';
import * as React from 'react';

import BiodataPhotoForm from '@/components/pages/biodata/BiodataPhotoForm';
import { Form, Modal } from 'antd';

export default function BiodataPhotoModal() {
	const { biodata, setBiodata } = useStore();
	const [form] = Form.useForm();

	React.useEffect(() => {
		const { formType, selectedData } = biodata;
		if (formType === 'photo' && selectedData?.image) form.setFieldsValue({ image: selectedData.image });
	}, [form, biodata]);

	const onCancel = () => {
		form.resetFields();
		setBiodata({
			formType: 'password',
			modalPasswordVisible: false,
			modalPhotoVisible: false,
		});
	};

	return (
		<Modal title='Ubah Foto Profil' open={biodata.modalPhotoVisible} onCancel={onCancel} width={400} footer={null} centered>
			<div style={{ paddingTop: 10 }}>
				<BiodataPhotoForm form={form} onCancel={onCancel} />
			</div>
		</Modal>
	);
}
