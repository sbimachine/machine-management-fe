import { addTeknisi, updateTeknisi } from '@/requests';
import roles from '@/roles';
import { useStore } from '@/states';
import { pickObject } from '@/utils/object';
import { parseFormData } from '@/utils/parse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import * as React from 'react';

import { CheckOutlined, CloseOutlined, LockOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Flex, Form, Input, notification, Select } from 'antd';

export default function TeknisiForm({ form, onCancel }) {
	const [submitLoading, setSubmitLoading] = React.useState(false);

	const [notif, notifContext] = notification.useNotification();
	const { teknisi } = useStore();
	const queryClient = useQueryClient();

	const queryMutation = useMutation({
		mutationFn: teknisi.formType === 'add' ? addTeknisi : updateTeknisi,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['teknisi'] });
			const aksiMsg = teknisi.formType === 'add' ? 'Ditambahkan' : 'Diperbarui';
			notif.success({ message: `Berhasil ${aksiMsg}`, description: `Data Karyawan Berhasil ${aksiMsg}` });
			setSubmitLoading(false);
			onCancel();
		},
		onError: (err) => {
			const aksiMsg = teknisi.formType === 'add' ? 'Ditambahkan' : 'Diperbarui';
			notif.error({ message: `Gagal ${aksiMsg}`, description: err.message });
			setSubmitLoading(false);
		},
	});

	const btnOk = React.useMemo(() => {
		if (teknisi.formType === 'add') return { text: 'Tambah', icon: <PlusOutlined /> };
		return { text: 'Simpan', icon: <CheckOutlined /> };
	}, [teknisi.formType]);

	const onSubmit = (value) => {
		setSubmitLoading(true);
		if (teknisi.formType === 'add') {
			const { firstName, lastName } = value;
			const parsedData = parseFormData(value);
			queryMutation.mutate({ ...parsedData, username: _.lowerCase(`${firstName}${lastName}`) });
		} else {
			const selectedData = pickObject(value, ['id', 'firstName', 'lastName', 'role']);
			const checkData = _.isEqual(pickObject(teknisi.selectedData, ['id', 'firstName', 'lastName', 'role']), selectedData);
			if (!checkData) {
				const { id, ...others } = selectedData;
				const parsedData = parseFormData(others);
				queryMutation.mutate({ id, newData: parsedData });
			} else {
				notif.info({ message: 'Tidak ada perubahan', description: 'Data Karyawan Tidak Berubah' });
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

				{/* Karyawan Name */}
				<Form.Item label='Nama Depan' name='firstName' rules={[{ required: true, message: 'Harap masukkan nama depan' }]}>
					<Input placeholder='Masukkan nama depan' disabled={submitLoading} allowClear />
				</Form.Item>
				<Form.Item label='Nama Belakang' name='lastName'>
					<Input placeholder='Masukkan nama belakang' disabled={submitLoading} allowClear />
				</Form.Item>

				{/* Email */}
				{teknisi.formType === 'add' ? (
					<Form.Item label='Email' name='email' rules={[{ required: true, message: 'Harap masukkan email' }]}>
						<Input placeholder='Masukkan email' disabled={submitLoading} allowClear />
					</Form.Item>
				) : null}

				{/* Phone Number */}
				{teknisi.formType === 'add' ? (
					<Form.Item label='No. Telepon' name='phone' rules={[{ required: true, message: 'Harap masukkan no. telepon' }]}>
						<Input placeholder='Masukkan no. telepon' disabled={submitLoading} allowClear />
					</Form.Item>
				) : null}

				{/* Role */}
				<Form.Item name='role' label='Role' rules={[{ required: true, message: 'Harap pilih role karyawan' }]}>
					<Select
						placeholder='Pilih kategori karyawan'
						options={Object.keys(roles).map((item) => ({ value: item, label: _.startCase(item) }))}
						disabled={submitLoading}
						allowClear
					/>
				</Form.Item>

				{/* Password */}
				{teknisi.formType === 'add' ? (
					<Form.Item name='password' label='Password' rules={[{ required: true, message: 'Harap masukan password' }]}>
						<Input.Password
							prefix={<LockOutlined />}
							type='password'
							size='large'
							placeholder='Password'
							disabled={submitLoading}
						/>
					</Form.Item>
				) : null}

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
