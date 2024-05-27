import { changePhoto } from '@/requests';
import { getBase64 } from '@/utils/base64';
import { parseFormData } from '@/utils/parse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';

import { CheckOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Image, notification, Upload } from 'antd';

export default function BiodataPhotoForm({ form, onCancel }) {
	const [submitLoading, setSubmitLoading] = React.useState(false);
	const [imagePreview, setImagePreview] = React.useState(null);
	const [previewVisible, setPreviewVisible] = React.useState(false);

	const [notif, notifContext] = notification.useNotification();
	const queryClient = useQueryClient();
	const watchImage = Form.useWatch('image', form);

	const queryMutation = useMutation({
		mutationFn: changePhoto,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['biodata'] });
			notif.success({ message: 'Berhasil Diperbarui', description: `Foto Profil Berhasil Diperbarui` });
			setSubmitLoading(false);
			onCancel();
		},
		onError: (err) => {
			notif.error({ message: 'Gagal Diperbarui', description: err.message });
			setSubmitLoading(false);
		},
	});

	const onSubmit = (value) => {
		setSubmitLoading(true);
		const parsedData = parseFormData(value, { file: ['image'] });
		const formData = new FormData();
		Object.entries(parsedData).forEach(([key, value]) => formData.append(key, value));
		queryMutation.mutate(formData);
	};

	const normFile = (e) => {
		if (Array.isArray(e)) return e;
		return e?.fileList;
	};

	const onPreview = async (file) => {
		if (!file.url && !file.preview) file.preview = await getBase64(file.originFileObj);
		setImagePreview(file.url || file.preview);
		setPreviewVisible(true);
	};

	return (
		<Form form={form} layout='vertical' onFinish={onSubmit}>
			{/* Image */}
			<Form.Item
				name='image'
				label='Gambar'
				valuePropName='fileList'
				getValueFromEvent={normFile}
				rules={[{ type: 'array', required: true, message: 'Harap pilih gambar!' }]}
			>
				<Upload name='image' listType='picture' onPreview={onPreview} maxCount={1}>
					<Button icon={<UploadOutlined />} disabled={watchImage?.length > 0}>
						Pilih Gambar
					</Button>
				</Upload>
			</Form.Item>
			{imagePreview ? (
				<Image
					wrapperStyle={{ display: 'none' }}
					preview={{
						visible: previewVisible,
						onVisibleChange: (visible) => setPreviewVisible(visible),
						afterOpenChange: (visible) => !visible && setImagePreview(null),
					}}
					src={imagePreview}
					alt='Gambar Mesin'
				/>
			) : null}

			{/* Button Action */}
			<Form.Item style={{ marginBottom: 10 }}>
				<Flex justify='flex-end' gap={10}>
					<Button type='primary' htmlType='submit' size='large' icon={<CheckOutlined />} loading={submitLoading}>
						Perbarui
					</Button>
					<Button size='large' icon={<CloseOutlined />} onClick={onCancel} loading={submitLoading}>
						Batal
					</Button>
				</Flex>
			</Form.Item>

			{notifContext}
		</Form>
	);
}
