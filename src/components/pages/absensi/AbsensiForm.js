import { addAbsensi } from '@/requests';
import { useStore } from '@/states';
import { parseFormData } from '@/utils/parse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';

import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Flex, Form, Input, notification, Select } from 'antd';

export default function PerbaikanForm({ form, onCancel }) {
	const [submitLoading, setSubmitLoading] = React.useState(false);

	const [notif, notifContext] = notification.useNotification();
	const { perbaikan } = useStore();
	const queryClient = useQueryClient();

	const queryMutation = useMutation({
		mutationFn: addAbsensi,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['absensi'] });
			notif.success({ message: 'Berhasil Ditambahkan', description: 'Data Absensi Berhasil Ditambahkan' });
			setSubmitLoading(false);
			onCancel();
		},
		onError: (err) => {
			notif.error({ message: 'Gagal Ditambahkan', description: err.message });
			setSubmitLoading(false);
		},
	});

	const btnOk = React.useMemo(() => {
		if (perbaikan.formType === 'add') return { text: 'Tambah', icon: <PlusOutlined /> };
		return { text: 'Simpan', icon: <CheckOutlined /> };
	}, [perbaikan.formType]);

	const onSubmit = (value) => {
		setSubmitLoading(true);
		const parsedData = parseFormData(value);
		queryMutation.mutate(parsedData);
	};

	return (
		<ConfigProvider theme={{ token: { colorTextDisabled: 'rgba(0, 0, 0, 0.88)' } }}>
			<Form form={form} layout='vertical' onFinish={onSubmit}>
				{/* Hidden Fields */}
				<Form.Item name='id' hidden>
					<Input />
				</Form.Item>

				<Form.Item name='status' label='Status Absensi' rules={[{ required: true, message: 'Harap pilih status absensi' }]}>
					<Select
						placeholder='Pilih status Absensi'
						options={[
							{ value: 'present', label: 'Hadir' },
							{ value: 'leave', label: 'Cuti' },
							{ value: 'sick', label: 'Sakit' },
						]}
						disabled={submitLoading}
						allowClear
					/>
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
