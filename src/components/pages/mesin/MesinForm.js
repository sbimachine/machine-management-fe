import { addMesin, updateMesin } from '@/requests';
import { useStore } from '@/states';
import { getBase64 } from '@/utils/base64';
import { parseFormData } from '@/utils/parse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import * as React from 'react';

import { CheckOutlined, CloseOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, DatePicker, Flex, Form, Image, Input, notification, Select, Upload } from 'antd';

export default function MesinForm({ form, onCancel }) {
	const [submitLoading, setSubmitLoading] = React.useState(false);
	const [imagePreview, setImagePreview] = React.useState(null);
	const [previewVisible, setPreviewVisible] = React.useState(false);

	const [notif, notifContext] = notification.useNotification();
	const { kategori: getKategori, mesin } = useStore();
	const { kategori } = getKategori;
	const queryClient = useQueryClient();
	const watchImage = Form.useWatch('image', form);

	const queryMutation = useMutation({
		mutationFn: mesin.formType === 'add' ? addMesin : updateMesin,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['mesin'] });
			const aksiMsg = mesin.formType === 'add' ? 'Ditambahkan' : 'Diperbarui';
			notif.success({ message: `Berhasil ${aksiMsg}`, description: `Data Mesin Berhasil ${aksiMsg}` });
			setSubmitLoading(false);
			onCancel();
		},
		onError: (err) => {
			const aksiMsg = mesin.formType === 'add' ? 'Ditambahkan' : 'Diperbarui';
			notif.error({ message: `Gagal ${aksiMsg}`, description: err.message });
			setSubmitLoading(false);
		},
	});

	const btnOk = React.useMemo(() => {
		if (mesin.formType === 'add') return { text: 'Tambah', icon: <PlusOutlined /> };
		return { text: 'Simpan', icon: <CheckOutlined /> };
	}, [mesin.formType]);

	const normFile = (e) => {
		if (Array.isArray(e)) return e;
		return e?.fileList;
	};

	const onPreview = async (file) => {
		if (!file.url && !file.preview) file.preview = await getBase64(file.originFileObj);
		setImagePreview(file.url || file.preview);
		setPreviewVisible(true);
	};

	const onSubmit = (value) => {
		setSubmitLoading(true);
		if (mesin.formType === 'add') {
			const parsedData = parseFormData(value, { datePicker: ['buyDate'], file: ['image'] });
			const formData = new FormData();
			Object.entries(parsedData).forEach(([key, value]) => formData.append(key, value));
			queryMutation.mutate(formData);
		} else {
			const checkData = _.isEqual(mesin.selectedData, value);
			if (!checkData) {
				const { id, ...others } = value;
				const parsedData = parseFormData(others, { datePicker: ['buyDate'], file: ['image'] });
				const formData = new FormData();
				Object.entries(parsedData).forEach(([key, value]) => formData.append(key, value));
				queryMutation.mutate({ id, newData: formData });
			} else {
				notif.info({ message: 'Tidak ada perubahan', description: 'Data Mesin Tidak Berubah' });
				setSubmitLoading(false);
				onCancel();
			}
		}
	};

	return (
		<ConfigProvider theme={{ token: { colorTextDisabled: 'rgba(0, 0, 0, 0.88)' } }}>
			<Form form={form} layout='vertical' onFinish={onSubmit}>
				{/* Hidden Fields */}
				<Form.Item name='id' hidden>
					<Input />
				</Form.Item>

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

				{/* Machine Name */}
				<Form.Item name='machineName' label='Nama' rules={[{ required: true, message: 'Harap masukkan nama mesin' }]}>
					<Input placeholder='Masukkan nama mesin' disabled={submitLoading} allowClear />
				</Form.Item>

				{/* Category */}
				<Form.Item name='categoryName' hidden>
					<Input />
				</Form.Item>
				<Form.Item name='categoryId' label='Kategori' rules={[{ required: true, message: 'Harap pilih kategori mesin' }]}>
					<Select
						placeholder='Pilih kategori mesin'
						onChange={(_, { label }) => form.setFieldsValue({ categoryName: label })}
						options={kategori?.map((item) => ({ value: item.id, label: item.categoryName }))}
						disabled={submitLoading}
						allowClear
					/>
				</Form.Item>

				{/* Buy Date */}
				<Form.Item
					name='buyDate'
					label='Tanggal'
					rules={[{ type: 'object', required: true, message: 'Harap pilih tanggal beli mesin' }]}
				>
					<DatePicker
						format='DD-MM-YYYY'
						placeholder='Masukkan tanggal beli mesin'
						style={{ width: '100%' }}
						disabled={submitLoading}
					/>
				</Form.Item>

				{/* Description */}
				<Form.Item name='description' label='Keterangan'>
					<Input.TextArea placeholder='Masukkan keterangan' rows={3} disabled={submitLoading} allowClear />
				</Form.Item>

				{/* Button Action */}
				<Form.Item style={{ marginBottom: 10 }}>
					<Flex justify='flex-end' gap={10}>
						<Button type='primary' htmlType='submit' size='large' icon={btnOk.icon} loading={submitLoading}>
							{btnOk.text}
						</Button>
						<Button size='large' icon={<CloseOutlined />} onClick={onCancel} loading={submitLoading}>
							Batal
						</Button>
					</Flex>
				</Form.Item>
				{notifContext}
			</Form>
		</ConfigProvider>
	);
}
