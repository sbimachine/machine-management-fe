import { getPerbaikanById, reportPenugasan } from '@/requests';
import { useStore } from '@/states';
import { getBase64 } from '@/utils/base64';
import { useUser } from '@/utils/hooks';
import { getMimeTypes } from '@/utils/mimeTypes';
import { parseDate, parseFormData } from '@/utils/parse';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { startCase } from 'lodash';
import * as React from 'react';

import PerbaikanFormSelectMesin from '@/components/pages/perbaikan/PerbaikanFormSelectMesin';
import { CheckOutlined, CloseOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, DatePicker, Flex, Form, Image, Input, notification, Select, Upload } from 'antd';

export default function PenugasanForm({ form, onCancel }) {
	const [submitLoading, setSubmitLoading] = React.useState(false);
	const [imagePreview, setImagePreview] = React.useState(null);
	const [previewVisible, setPreviewVisible] = React.useState(false);

	const [notif, notifContext] = notification.useNotification();
	const { penugasan, setPenugasan } = useStore();
	const queryClient = useQueryClient();
	const user = useUser();

	const isGetPenugasanById = React.useMemo(() => {
		const { formType, selectedData } = penugasan;
		return formType === 'update' && selectedData && !selectedData.machine;
	}, [penugasan]);

	const penugasanById = useQuery({
		queryKey: ['penugasan', penugasan?.selectedData?.id],
		queryFn: async () => {
			try {
				const { selectedData } = penugasan;
				const data = await getPerbaikanById(selectedData?.id);
				const { id, repairmentDate, description, machine, leaderFirstName, leaderLastName, category } = data;
				const fieldData = {
					machineId: machine.machineId,
					repairmentDate: parseDate(repairmentDate, true),
					leaderName: startCase(`${leaderFirstName} ${leaderLastName}`),
					category,
				};
				setPenugasan({ selectedData: data });
				form.setFieldsValue({ id, description, ...fieldData });
				return data;
			} catch (err) {
				notif.error({ message: `Gagal Mengambil Data`, description: err.message });
				throw new Error(err);
			}
		},
		enabled: !!isGetPenugasanById,
	});

	const queryMutation = useMutation({
		mutationFn: reportPenugasan,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['penugasan'] });
			notif.success({ message: `Berhasil Dilaporkan`, description: 'Data Perbaikan Berhasil Dilaporkan' });
			setSubmitLoading(false);
			onCancel();
		},
		onError: (err) => {
			notif.error({ message: `Gagal Dilaporkan`, description: err.message });
			setSubmitLoading(false);
		},
	});

	const onSubmit = (value) => {
		setSubmitLoading(true);
		const { id, images } = parseFormData(value, { multipleFile: ['images'] });
		const formData = new FormData();
		images.forEach((image) => formData.append('images', image));
		queryMutation.mutate({ id, newData: formData });
	};

	const normFile = (e) => {
		if (Array.isArray(e)) return e;
		return e?.fileList;
	};

	const validateBefore = (mimeTypes, errors) => (file) => {
		const mimeTypesArr = getMimeTypes(mimeTypes).split(',');
		const mimeTypesMsg = mimeTypesArr.filter((mime) => mime.startsWith('.')).join(', ');
		const checkFileType = mimeTypesArr.includes(file.type);
		if (!checkFileType) form.setFields(errors.map((name) => ({ name, errors: [`File harus bertipe ${mimeTypesMsg}`] })));
		return checkFileType || Upload.LIST_IGNORE;
	};

	const onPreview = async (file) => {
		if (!file.url && !file.preview) file.preview = await getBase64(file.originFileObj);
		setImagePreview(file.url || file.preview);
		setPreviewVisible(true);
	};

	const btnOk = React.useMemo(() => {
		if (penugasan.formType === 'add') return { text: 'Tambah', icon: <PlusOutlined /> };
		return { text: 'Simpan', icon: <CheckOutlined /> };
	}, [penugasan.formType]);

	const disabledForm = React.useMemo(
		() => submitLoading || penugasanById.isFetching || user?.role === 'teknisi',
		[user, submitLoading, penugasanById]
	);

	return (
		<ConfigProvider theme={{ token: { colorTextDisabled: 'rgba(0, 0, 0, 0.88)' } }}>
			<Form form={form} layout='vertical' onFinish={onSubmit}>
				{/* Hidden Fields */}
				<Form.Item name='id' hidden>
					<Input />
				</Form.Item>

				{/* Machine */}
				<PerbaikanFormSelectMesin loading={penugasanById.isFetching} disabled={disabledForm} />

				{/* Ditugaskan oleh */}
				<Form.Item
					name='leaderName'
					label='Ditugaskan oleh'
					rules={[{ required: true, message: 'Harap isi ditugaskan oleh' }]}
					validateStatus={penugasanById.isFetching ? 'validating' : ''}
					hasFeedback
				>
					<Input placeholder='Pilih Ditugaskan oleh' disabled={disabledForm} />
				</Form.Item>

				{/* Repairment Date */}
				<Form.Item
					name='repairmentDate'
					label='Tanggal Kerusakan'
					rules={[{ type: 'object', required: true, message: 'Harap pilih tanggal penugasan' }]}
					validateStatus={penugasanById.isFetching ? 'validating' : ''}
					hasFeedback
				>
					<DatePicker
						format='DD-MM-YYYY HH:MM'
						placeholder='Masukan tanggal penugasan'
						style={{ width: '100%' }}
						disabled={disabledForm}
						showTime
						allowClear
					/>
				</Form.Item>

				{/* Category */}
				<Form.Item
					name='category'
					label='Kategori Kerusakan'
					rules={[{ required: true, message: 'Harap pilih kategori kerusakan' }]}
					validateStatus={penugasanById.isFetching ? 'validating' : ''}
					hasFeedback
				>
					<Select
						placeholder='Pilih kategori mesin'
						options={[
							{ value: 'Berat', label: 'Berat' },
							{ value: 'Ringan', label: 'Ringan' },
						]}
						disabled={disabledForm}
						allowClear
					/>
				</Form.Item>

				{/* Description */}
				<Form.Item
					name='description'
					label='Keterangan'
					rules={[{ required: true, message: 'Harap masukan keterangan' }]}
					validateStatus={penugasanById.isFetching ? 'validating' : ''}
					hasFeedback
				>
					<Input.TextArea placeholder='Masukkan keterangan' rows={3} disabled={disabledForm} allowClear />
				</Form.Item>

				{/* Image */}
				<Form.Item
					name='images'
					label='Foto Laporan Perbaikan'
					valuePropName='fileList'
					getValueFromEvent={normFile}
					rules={[{ type: 'array', required: true, message: 'Harap pilih Foto!' }]}
				>
					<Upload
						name='images'
						listType='picture'
						accept={getMimeTypes('images')}
						beforeUpload={validateBefore('images', ['images'])}
						onPreview={onPreview}
						multiple
					>
						<Button icon={<UploadOutlined />} disabled={submitLoading || penugasanById.isFetching}>
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
						<Button
							type='primary'
							htmlType='submit'
							size='large'
							icon={btnOk.icon}
							loading={submitLoading || penugasanById.isFetching}
						>
							{btnOk.text}
						</Button>
						<Button
							size='large'
							icon={<CloseOutlined />}
							onClick={onCancel}
							loading={submitLoading || penugasanById.isFetching}
						>
							Batal
						</Button>
					</Flex>
				</Form.Item>

				{notifContext}
			</Form>
		</ConfigProvider>
	);
}
