import { changePassword } from '@/requests';
import { useStore } from '@/states';
import { pickObject } from '@/utils/object';
import { parseFormData } from '@/utils/parse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';

import { CheckOutlined, CloseOutlined, LockOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, notification } from 'antd';

export default function BiodataPasswordForm({ form, onCancel }) {
	const [submitLoading, setSubmitLoading] = React.useState(false);

	const [notif, notifContext] = notification.useNotification();
	const { biodata, setBiodata } = useStore();
	const queryClient = useQueryClient();

	const queryMutation = useMutation({
		mutationFn: changePassword,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['biodata'] });
			notif.success({ message: 'Berhasil Diperbarui', description: `Password Berhasil Diperbarui` });
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
		const parsedData = pickObject(parseFormData(value), ['oldPassword', 'newPassword']);
		queryMutation.mutate(parsedData);
	};

	const validasiPassword = ({ getFieldValue }) => ({
		validator: (_, value) => {
			if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
			return Promise.reject(new Error('Password yang Anda masukkan tidak cocok!'));
		},
	});

	return (
		<Form form={form} layout='vertical' onFinish={onSubmit}>
			{/* Old Password */}
			<Form.Item
				name='oldPassword'
				label='Password Saat Ini'
				rules={[{ required: true, message: 'Harap masukan Password Anda saat ini!' }]}
			>
				<Input.Password prefix={<LockOutlined />} type='password' size='large' placeholder='Password Saat Ini' />
			</Form.Item>

			{/* New Password */}
			<Form.Item
				name='newPassword'
				label='Password Baru'
				rules={[{ required: true, message: 'Harap masukan Password baru Anda!' }]}
			>
				<Input.Password prefix={<LockOutlined />} type='password' size='large' placeholder='Password Baru' />
			</Form.Item>

			{/* Confirm Password */}
			<Form.Item
				name='confirmPassword'
				label='Konfirmasi Password'
				dependencies={['password']}
				rules={[{ required: true, message: 'Harap masukan konfirmasi Password Anda!' }, validasiPassword]}
			>
				<Input.Password prefix={<LockOutlined />} type='password' size='large' placeholder='Konfirmasi Password' />
			</Form.Item>

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
