import { addPerbaikan, assignPerbaikan, getPerbaikanById, updatePerbaikan, updateStatusPerbaikan } from '@/requests';
import { useStore } from '@/states';
import { getBase64 } from '@/utils/base64';
import { useUser } from '@/utils/hooks';
import { pickObject } from '@/utils/object';
import { parseDate, parseFormData, parseFormFile } from '@/utils/parse';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';

import PerbaikanFormSelectMesin from '@/components/pages/perbaikan/PerbaikanFormSelectMesin';
import PerbaikanFormSelectTeknisi from '@/components/pages/perbaikan/PerbaikanFormSelectTeknisi';
import { CheckOutlined, CloseOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, DatePicker, Flex, Form, Image, Input, notification, Select, Upload } from 'antd';

export default function PerbaikanForm({ form, onCancel }) {
	const [submitLoading, setSubmitLoading] = React.useState(false);
	const [imagePreview, setImagePreview] = React.useState(null);
	const [previewVisible, setPreviewVisible] = React.useState(false);

	const [notif, notifContext] = notification.useNotification();
	const { perbaikan, setPerbaikan } = useStore();
	const queryClient = useQueryClient();
	const user = useUser();

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
				const { id, repairmentDate, userId, description, status, machine, images } = data;
				const parsedImages =
					userId && images?.length > 0
						? images.map((image, i) => {
								return parseFormFile({
									image: { urls: [image.imageUrl], filename: `Laporan Perbaikan #${i + 1}` },
								}).image[0];
							})
						: [];
				const fieldData = {
					userId,
					machineId: machine.machineId,
					repairmentDate: parseDate(repairmentDate, true),
					images: parsedImages,
					status,
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
			const parsedData = parseFormData(value, { datePicker: ['repairmentDate'] });
			queryMutation.mutate(parsedData);
		} else {
			const { id, repairmentDate, userId, description, machine, status } = perbaikan.selectedData;
			const previousData = {
				id,
				userId,
				description,
				machineId: machine.machineId,
				repairmentDate: parseDate(repairmentDate, true),
				status,
			};
			const checkData = _.isEqual(previousData, value);
			if (!checkData) {
				const { id: _id, ...others } = value;
				const parsedData = parseFormData(others, { datePicker: ['repairmentDate'] });
				const newData =
					user?.role === 'leader'
						? userId
							? pickObject(parsedData, ['status'])
							: pickObject(parsedData, ['userId'])
						: parsedData;
				queryMutation.mutate({ id, newData });
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

				{/* Teknisi */}
				{user?.role === 'leader' && !perbaikan?.selectedData?.userId ? (
					<PerbaikanFormSelectTeknisi loading={perbaikanById.isFetching} disabled={disabledProduksiForm} />
				) : null}

				{/* Image */}
				{user?.role === 'leader' && perbaikan?.selectedData?.userId ? (
					<>
						<Form.Item
							name='images'
							label='Gambar'
							valuePropName='fileList'
							getValueFromEvent={normFile}
							rules={[{ type: 'array', required: true, message: 'Harap pilih gambar!' }]}
						>
							<Upload name='image' listType='picture' onPreview={onPreview} disabled>
								<Button icon={<UploadOutlined />} disabled>
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
