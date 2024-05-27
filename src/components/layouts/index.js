'use client';

import * as React from 'react';
import { useStore } from '@/states';

import { Layout as AntLayout, Button, Flex, theme } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Drawer from '@/components/layouts/Drawer';
import MenuBar from '@/components/layouts/MenuBar';
import UserAvatar from '@/components/layouts/UserAvatar';
import QueryProvider from '@/components/providers/QueryProvider';

export default function Layout({ children }) {
	const { sidebar, setSidebar } = useStore();
	const { token } = theme.useToken();

	const onClickHumburger = () => {
		if (!sidebar.isDrawer) setSidebar({ collapsed: !sidebar.collapsed });
		else setSidebar({ openDrawer: !sidebar.openDrawer });
	};
	const onBreakpointSider = (breakpoint) => {
		setSidebar({ isDrawer: breakpoint, openDrawer: false, collapsed: breakpoint });
	};

	return (
		<QueryProvider>
			<AntLayout style={{ minHeight: '100vh' }} hasSider>
				<AntLayout.Sider
					breakpoint='lg'
					collapsedWidth={sidebar.isDrawer ? '0' : '85'}
					onBreakpoint={onBreakpointSider}
					trigger={null}
					width={300}
					collapsed={sidebar.collapsed}
					collapsible
					style={{
						overflow: 'auto',
						height: '100vh',
						position: 'sticky',
						left: 0,
						top: 0,
						bottom: 0,
					}}
				>
					<div style={{ width: '100%', height: '40px', margin: '10px auto 20px' }} />
					<MenuBar />
				</AntLayout.Sider>
				<Drawer />
				<AntLayout>
					<AntLayout.Header
						style={{
							padding: '0',
							background: token.colorBgContainer,
							position: 'sticky',
							top: 0,
							zIndex: 1,
							width: '100%',
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<Flex align='center' justify='space-between' style={{ width: '100%' }}>
							<Button
								type='text'
								icon={<MenuOutlined />}
								onClick={onClickHumburger}
								style={{ fontSize: '16px', width: 64, height: 64 }}
							/>
							<UserAvatar />
						</Flex>
					</AntLayout.Header>
					<AntLayout.Content
						style={{
							margin: '24px 16px',
							padding: 24,
							background: token.colorBgContainer,
							borderRadius: token.borderRadiusLG,
						}}
					>
						{children}
					</AntLayout.Content>
				</AntLayout>
			</AntLayout>
		</QueryProvider>
	);
}
