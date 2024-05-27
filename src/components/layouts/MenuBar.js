import { useStore } from '@/states';
import { useRoleMenu, useUser } from '@/utils/hooks';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

import {
	CarryOutOutlined,
	FileDoneOutlined,
	FileSearchOutlined,
	SettingOutlined,
	TeamOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';

export default function MenuBar({ inDrawer = false }) {
	const { setSidebar } = useStore();
	const { menu: roleMenu } = useRoleMenu();
	const user = useUser();
	const pathname = usePathname();
	const router = useRouter();

	const selectedKey = React.useMemo(() => `${pathname === '/' ? undefined : pathname}`, [pathname]);

	const labelMenu = React.useMemo(() => {
		let labels = {};
		if (user?.role === 'supervisior') Object.assign(labels, { teknisi: 'Data Karyawan' });
		else Object.assign(labels, { teknisi: 'Data Teknisi' });
		return labels;
	}, [user]);

	const allMenu = React.useMemo(
		() => [
			{ key: '/absensi', icon: <CarryOutOutlined style={{ fontSize: 18 }} />, label: 'Absensi' },
			{ key: '/mesin', icon: <SettingOutlined style={{ fontSize: 18 }} />, label: 'Data Mesin' },
			{ key: '/perbaikan', icon: <FileSearchOutlined style={{ fontSize: 18 }} />, label: 'Laporan Perbaikan' },
			{ key: '/hasil-perbaikan', icon: <FileDoneOutlined style={{ fontSize: 18 }} />, label: 'Laporan Hasil Perbaikan' },
			{ key: '/teknisi', icon: <TeamOutlined style={{ fontSize: 18 }} />, label: labelMenu.teknisi },
			{ key: '/biodata', icon: <UserOutlined style={{ fontSize: 18 }} />, label: 'Biodata' },
		],
		[labelMenu]
	);

	const menuList = React.useMemo(() => {
		if (roleMenu) {
			const menuKeys = new Set(roleMenu.map((menus) => menus.menu));
			return allMenu.filter((item) => menuKeys.has(item.key));
		}
		return allMenu;
	}, [roleMenu, allMenu]);

	const onClickMenu = ({ key }) => {
		router.push(key);
		if (inDrawer) setSidebar({ openDrawer: false });
	};

	return (
		<Menu
			theme='dark'
			mode='inline'
			selectedKeys={[selectedKey]}
			items={menuList}
			onClick={onClickMenu}
			style={{ paddingInline: '15px' }}
		/>
	);
}
