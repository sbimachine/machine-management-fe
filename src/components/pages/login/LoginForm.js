'use client';

import { reqLogin } from '@/requests';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { LockOutlined, LoginOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Form, Grid, Input, notification, theme } from 'antd';

export default function LoginForm() {
	const [submitLoading, setSubmitLoading] = React.useState(false);
	const [notif, notifContext] = notification.useNotification();
	const { token } = theme.useToken();
	const { xs } = Grid.useBreakpoint();
	const router = useRouter();

	const onLogin = async (values) => {
		try {
			setSubmitLoading(true);
			await reqLogin(values);
			notif.success({ message: 'Berhasil Masuk', description: 'Selamat Datang Kembali!' });
			setSubmitLoading(false);
			setTimeout(() => router.replace('/'), 500);
		} catch (err) {
			notif.error({ message: 'Gagal Masuk', description: 'Email/Username atau Password salah!' });
			setSubmitLoading(false);
		}
	};

	return (
		<Card bordered={false} style={{ width: 400, padding: 10, margin: xs ? 15 : 0 }}>
			<Flex vertical gap={30}>
				<Flex gap={15}>
					<ShopOutlined style={{ fontSize: xs ? 40 : 45, color: token.colorPrimary }} />
					<Flex vertical>
						<p style={{ fontSize: xs ? 18 : 20, margin: 0, fontWeight: 700 }}>PT Sumber Boga Indonesia</p>
						<span style={{ color: token.colorTextDescription }}>Machine Repairment System</span>
					</Flex>
				</Flex>

				<Form onFinish={onLogin}>
					<Form.Item name='emailOrUsername' rules={[{ required: true, message: 'Harap masukan Email/Username Anda!' }]}>
						<Input prefix={<UserOutlined />} size='large' placeholder='Email/Username' />
					</Form.Item>
					<Form.Item name='password' rules={[{ required: true, message: 'Harap masukan Password Anda!' }]}>
						<Input.Password prefix={<LockOutlined />} type='password' size='large' placeholder='Password' />
					</Form.Item>
					<Form.Item style={{ marginBottom: 10 }}>
						<Flex vertical align='flex-end' gap={10} style={{ marginTop: 10 }}>
							<Button type='primary' htmlType='submit' icon={<LoginOutlined />} size='large' loading={submitLoading} block>
								Masuk
							</Button>
							<p style={{ textAlign: 'center', fontSize: 12, color: token.colorTextLabel, margin: 0 }}>
								*Jika ada kendala terhadap akses login harap menghubungi supervisior
							</p>
						</Flex>
					</Form.Item>
				</Form>
			</Flex>
			{notifContext}
		</Card>
	);
}
