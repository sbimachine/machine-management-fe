import { capitalize, startCase } from 'lodash';
import { signOut, useSession } from 'next-auth/react';
import * as React from 'react';

import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Flex, Modal, Typography } from 'antd';

export default function UsersAvatar() {
	const [modal, contextHolder] = Modal.useModal();
	const { data: session } = useSession();

	const userMenu = React.useMemo(() => [{ key: '/logout', label: 'Keluar', icon: <LogoutOutlined />, danger: true }], []);
	const fullname = session?.user ? `${session?.user?.firstName} ${session?.user?.lastName}` : 'Username';
	const role = session?.user ? session?.user?.role : 'Role';
	const imageUrl = session?.user ? session?.user?.imageUrl : null;

	const onLogout = async () => {
		await modal.confirm({
			title: 'Apakah anda yakin ingin keluar?',
			content: 'Anda akan keluar dari akun ini dan tidak dapat mengakses aplikasi.',
			cancelText: 'Tidak',
			okText: 'Ya',
			centered: true,
			onOk: async () => await signOut(),
		});
	};

	const onClickMenu = async (menu) => {
		if (menu.key === '/logout') await onLogout();
	};

	return (
		<Flex align='center' gap='10px' style={{ paddingRight: '20px' }}>
			<Flex vertical align='flex-end'>
				<Typography.Text style={{ fontWeight: 700, lineHeight: 1 }}>{startCase(fullname)}</Typography.Text>
				<Typography.Text italic>{capitalize(role)}</Typography.Text>
			</Flex>
			<Dropdown menu={{ items: userMenu, onClick: onClickMenu }} trigger={['click']}>
				<Button type='text' shape='circle' style={{ padding: 0, width: 'fit-content', height: 'fit-content' }}>
					<Avatar size='large' src={imageUrl} icon={!imageUrl ? <UserOutlined /> : null} />
				</Button>
			</Dropdown>
			{contextHolder}
		</Flex>
	);
}
