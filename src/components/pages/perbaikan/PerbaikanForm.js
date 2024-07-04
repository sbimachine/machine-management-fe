import { addPerbaikan, assignPerbaikan, getPerbaikanById, updatePerbaikan, updateStatusPerbaikan } from '@/requests';
import { useStore } from '@/states';
import { getBase64 } from '@/utils/base64';
import { useUser } from '@/utils/hooks';
import { getMimeTypes } from '@/utils/mimeTypes';
import { omitObject, pickObject } from '@/utils/object';
import { getDate, parseDate, parseFormData, parseFormFile } from '@/utils/parse';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isEqual } from 'lodash';
import * as React from 'react';

import PerbaikanFormSelectMesin from '@/components/pages/perbaikan/PerbaikanFormSelectMesin';
import PerbaikanFormSelectTeknisi from '@/components/pages/perbaikan/PerbaikanFormSelectTeknisi';
import { CheckOutlined, CloseOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import {
	Button,
	ConfigProvider,
	DatePicker,
	Empty,
	Flex,
	Form,
	Image,
	Input,
	notification,
	Select,
	Skeleton,
	theme,
	Upload,
} from 'antd';

export default function PerbaikanForm({ form, onCancel }) {
	const [submitLoading, setSubmitLoading] = React.useState(false);
	const [imagePreview, setImagePreview] = React.useState(null);
	const [previewVisible, setPreviewVisible] = React.useState(false);
	const { token } = theme.useToken();

	const [notif, notifContext] = notification.useNotification();
	const { perbaikan, setPerbaikan } = useStore();
	const queryClient = useQueryClient();
	const user = useUser();

	React.useEffect(() => {
		if (perbaikan.formType === 'add') form.setFieldsValue({ repairmentDate: getDate(new Date()) });
		else form.setFieldsValue({ repairmentDate: undefined });
	}, [form, perbaikan.formType]);

	const isGetPerbaikanById = React.useMemo(() => {
		const { formType, selectedData } = perbaikan;
		return formType === 'update' && selectedData && !selectedData.machine;
	}, [perbaikan]);

	const checkApi = React.useMemo(() => {
		if (perbaikan.formType === 'add') {
			return addPerbaikan;
		} else {
			if (user?.role === 'leader') {
				if (perbaikan.selectedData.userId) return updateStatusPerbaikan;
				return assignPerbaikan;
			}
			return updatePerbaikan;
		}
	}, [perbaikan, user]);

	const perbaikanById = useQuery({
		queryKey: ['perbaikan', perbaikan?.selectedData?.id],
		queryFn: async () => {
			try {
				const { selectedData } = perbaikan;
				const data = await getPerbaikanById(selectedData?.id);
				const { id, repairmentDate, userId, description, status, category, machine, reportedImages } = data;
				const parsedReportedImages =
					reportedImages?.length > 0
						? parseFormFile({ images: { urls: reportedImages.map(({ imageUrl }) => imageUrl), filename: `Kerusakan` } })
						: [];
				const fieldData = {
					userId,
					machineId: machine.machineId,
					repairmentDate: parseDate(repairmentDate, true),
					category,
					status,
					...parsedReportedImages,
				};
				setPerbaikan({ selectedData: data });
				form.setFieldsValue({ id, description, ...fieldData });
				return data;
			} catch (err) {
				notif.error({ message: `Gagal Mengambil Data`, description: err.message });
				throw new Error(err);
			}
		},
		enabled: !!isGetPerbaikanById,
	});

	const queryMutation = useMutation({
		mutationFn: checkApi,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['perbaikan'] });
			const forLeader = user?.role === 'leader' ? 'Ditugaskan' : 'Diperbarui';
			const aksiMsg = perbaikan.formType === 'add' ? 'Ditambahkan' : forLeader;
			notif.success({ message: `Berhasil ${aksiMsg}`, description: `Data Laporan Perbaikan Berhasil ${aksiMsg}` });
			setSubmitLoading(false);
			onCancel();
		},
		onError: (err) => {
			const forLeader = user?.role === 'leader' ? 'Ditugaskan' : 'Diperbarui';
			const aksiMsg = perbaikan.formType === 'add' ? 'Ditambahkan' : forLeader;
			notif.error({ message: `Gagal ${aksiMsg}`, description: err.message });
			setSubmitLoading(false);
		},
	});

	const onSubmit = (value) => {
		setSubmitLoading(true);
		if (perbaikan.formType === 'add') {
			const { images, ...parsedData } = parseFormData(value, { datePicker: ['repairmentDate'], multipleFile: ['images'] });
			const formData = new FormData();
			Object.entries(parsedData).forEach(([key, value]) => formData.append(key, value));
			images.forEach((image) => formData.append('images', image));
			queryMutation.mutate(formData);
		} else {
			const {
				id,
				repairmentDate,
				userId,
				description,
				machine,
				category: categoryKerusakan,
				reportedImages: images,
				status: statusPerbaikan,
			} = perbaikan.selectedData;
			const files = parseFormFile({ images: { urls: images.map(({ imageUrl }) => imageUrl), filename: `Kerusakan` } });
			const status = userId ? { status: statusPerbaikan } : {};
			const category = categoryKerusakan ? { category: categoryKerusakan } : {};
			const previousData = {
				id,
				userId,
				description,
				machineId: machine.machineId,
				repairmentDate: parseDate(repairmentDate, true),
				...category,
				...status,
				...files,
			};
			const checkData = isEqual(previousData, value);
			if (!checkData) {
				const { id: _id, ...others } = value;
				const parsedData = parseFormData(others, { datePicker: ['repairmentDate'], multipleFile: ['images'] });
				const newData =
					user?.role === 'leader'
						? userId
							? pickObject(parsedData, ['status'])
							: pickObject(parsedData, ['userId'])
						: omitObject(parsedData, ['images']);
				const formData = new FormData();
				Object.entries(newData).forEach(([key, value]) => formData.append(key, value));
				console.table([...formData]);
				queryMutation.mutate({ id, newData: formData });
			} else {
				notif.info({ message: 'Tidak ada perubahan', description: 'Data Laporan Perbaikan Tidak Berubah' });
				setSubmitLoading(false);
				onCancel();
			}
		}
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
		if (perbaikan.formType === 'add') return { text: 'Tambah', icon: <PlusOutlined /> };
		return { text: 'Simpan', icon: <CheckOutlined /> };
	}, [perbaikan.formType]);

	const disabledForm = React.useMemo(
		() => submitLoading || perbaikanById.isFetching || user?.role === 'leader',
		[user, submitLoading, perbaikanById]
	);

	const disabledProduksiForm = React.useMemo(
		() => submitLoading || perbaikanById.isFetching,
		[submitLoading, perbaikanById]
	);

	return (
		<ConfigProvider theme={{ token: { colorTextDisabled: 'rgba(0, 0, 0, 0.88)' } }}>
			<Form form={form} layout='vertical' onFinish={onSubmit}>
				{/* Hidden Fields */}
				<Form.Item name='id' hidden>
					<Input />
				</Form.Item>
				{user?.role !== 'leader' && !perbaikan?.selectedData?.userId ? (
					<Form.Item name='userId' hidden>
						<Input />
					</Form.Item>
				) : null}
				{user?.role !== 'leader' && perbaikan?.selectedData?.userId ? (
					<Form.Item name='status' hidden>
						<Input />
					</Form.Item>
				) : null}

				{/* Machine */}
				<PerbaikanFormSelectMesin loading={perbaikanById.isFetching} disabled={disabledForm} />

				{/* Repairment Date */}
				<Form.Item
					name='repairmentDate'
					label='Tanggal Kerusakan'
					rules={[{ type: 'object', required: true, message: 'Harap pilih tanggal perbaikan' }]}
					validateStatus={perbaikanById.isFetching ? 'validating' : ''}
					hasFeedback
				>
					<DatePicker
						format='DD-MM-YYYY'
						placeholder='Masukan tanggal perbaikan'
						style={{ width: '100%' }}
						disabled={disabledForm}
						allowClear
					/>
				</Form.Item>

				{/* Description */}
				<Form.Item
					name='description'
					label='Keterangan'
					rules={[{ required: true, message: 'Harap masukan keterangan' }]}
					validateStatus={perbaikanById.isFetching ? 'validating' : ''}
					hasFeedback
				>
					<Input.TextArea placeholder='Masukkan keterangan' rows={3} disabled={disabledForm} allowClear />
				</Form.Item>

				{/* Category */}
				{user?.role === 'leader' && !perbaikan?.selectedData?.userId ? (
					<Form.Item
						name='category'
						label='Kategori Kerusakan'
						rules={[{ required: true, message: 'Harap pilih kategori kerusakan' }]}
					>
						<Select
							placeholder='Pilih kategori mesin'
							options={[
								{ value: 'Berat', label: 'Berat' },
								{ value: 'Ringan', label: 'Ringan' },
							]}
							disabled={disabledProduksiForm}
							allowClear
						/>
					</Form.Item>
				) : null}

				{/* Teknisi */}
				{user?.role === 'leader' && !perbaikan?.selectedData?.userId ? (
					<PerbaikanFormSelectTeknisi loading={perbaikanById.isFetching} disabled={disabledProduksiForm} />
				) : null}

				{/* Reported Image */}
				{user?.role !== 'leader' ? (
					<>
						<Form.Item
							name='images'
							label='Foto Kerusakan'
							valuePropName='fileList'
							getValueFromEvent={normFile}
							rules={[{ type: 'array', required: true, message: 'Harap pilih foto!' }]}
						>
							<Upload
								name='images'
								listType='picture'
								accept={getMimeTypes('images')}
								beforeUpload={validateBefore('images', ['images'])}
								onPreview={onPreview}
								multiple
							>
								<Button icon={<UploadOutlined />} disabled={disabledProduksiForm}>
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
					</>
				) : null}

				{/* Status */}
				{user?.role === 'leader' && perbaikan?.selectedData?.userId ? (
					<Form.Item name='status' label='Status' rules={[{ required: true, message: 'Harap pilih status perbaikan' }]}>
						<Select
							placeholder='Pilih status perbaikan'
							options={[
								{ value: 'Indent Sparepart', label: 'Indent Sparepart' },
								{ value: 'Tidak Bisa Diperbaiki', label: 'Tidak Bisa Diperbaiki' },
								{ value: 'Selesai Diperbaiki', label: 'Selesai Diperbaiki' },
							]}
							disabled={disabledProduksiForm}
							allowClear
						/>
					</Form.Item>
				) : null}

				<Flex gap={20} style={{ marginBottom: '25px' }}>
					{/* Reported Images Preview */}
					{user?.role === 'leader' ? (
						<Flex vertical gap={5} style={{ width: '100%' }}>
							<span style={{ fontWeight: 600, fontSize: '16px', lineHeight: 1.5 }}>Foto Laporan Kerusakan</span>
							{!perbaikanById.isFetching ? (
								<>
									{perbaikanById.data?.reportedImages?.length > 0 ? (
										<>
											<Image.PreviewGroup items={perbaikanById.data?.reportedImages?.map((image) => image.imageUrl)}>
												<Image
													width='100%'
													src={perbaikanById.data?.reportedImages[0]?.imageUrl}
													alt='Foto Laporan Kerusakan'
												/>
											</Image.PreviewGroup>
											<span style={{ color: token.colorTextDescription }}>Klik untuk melihat semua gambar</span>
										</>
									) : (
										<Flex justify='center' align='center' style={{ height: '100%', paddingTop: 20, paddingBottom: 20 }}>
											<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: 0 }} description='Foto belum tersedia' />
										</Flex>
									)}
								</>
							) : (
								<Skeleton loading={perbaikanById.isFetching} title={null} paragraph={{ rows: 5 }} active />
							)}
						</Flex>
					) : null}

					{/* Images Preview */}
					{user?.role === 'leader' ? (
						<Flex vertical gap={5} style={{ width: '100%' }}>
							<span style={{ fontWeight: 600, fontSize: '16px', lineHeight: 1.5 }}>Foto Laporan Perbaikan</span>
							{!perbaikanById.isFetching ? (
								<>
									{perbaikanById.data?.images?.length > 0 ? (
										<>
											<Image.PreviewGroup items={perbaikanById.data?.images?.map((image) => image.imageUrl)}>
												<Image width='100%' src={perbaikanById.data?.images[0]?.imageUrl} alt='Foto Laporan Perbaikan' />
											</Image.PreviewGroup>
											<span style={{ color: token.colorTextDescription }}>Klik untuk melihat semua gambar</span>
										</>
									) : (
										<Flex justify='center' align='center' style={{ height: '100%', paddingTop: 20, paddingBottom: 20 }}>
											<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: 0 }} description='Foto belum tersedia' />
										</Flex>
									)}
								</>
							) : (
								<Skeleton loading={perbaikanById.isFetching} title={null} paragraph={{ rows: 5 }} active />
							)}
						</Flex>
					) : null}
				</Flex>

				{/* Button Action */}
				<Form.Item style={{ marginBottom: 10 }}>
					<Flex justify='flex-end' gap={10}>
						<Button
							type='primary'
							htmlType='submit'
							size='large'
							icon={btnOk.icon}
							loading={submitLoading || perbaikanById.isFetching}
						>
							{btnOk.text}
						</Button>
						<Button
							size='large'
							icon={<CloseOutlined />}
							onClick={onCancel}
							loading={submitLoading || perbaikanById.isFetching}
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
