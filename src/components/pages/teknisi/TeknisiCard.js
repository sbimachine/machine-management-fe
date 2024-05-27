import { useStore } from '@/states';
import { useRoleMenu } from '@/utils/hooks';
import * as React from 'react';

import {
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	IdcardOutlined,
	LinkOutlined,
	MailOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Divider, Flex, List, Space, theme } from 'antd';

export default function TeknisiCard({ item }) {
	const { token } = theme.useToken();

	const { setTeknisi } = useStore();
	const { getPermission } = useRoleMenu();

	const onSetData = React.useCallback(
		(type) => {
			setTeknisi({
				formType: type,
				selectedData: item,
				modalShowVisible: type === 'show',
				modalUpdateVisible: type === 'update',
				modalDeleteVisible: type === 'delete',
			});
		},
		[item, setTeknisi]
	);

	const actionBtn = React.useMemo(
		() => ({
			show: <Button type='primary' icon={<EyeOutlined />} onClick={() => onSetData('show')} />,
			edit: <Button type='primary' icon={<EditOutlined />} onClick={() => onSetData('update')} />,
			delete: <Button type='primary' icon={<DeleteOutlined />} onClick={() => onSetData('delete')} danger />,
		}),
		[onSetData]
	);

	const checkRoleBtn = React.useMemo(() => {
		const permission = getPermission('/teknisi');
		if (permission) {
			const checkAction = {
				show: permission.includes('R') ? actionBtn.show : null,
				edit: permission.includes('U') ? actionBtn.edit : null,
				delete: permission.includes('D') ? actionBtn.delete : null,
			};
			return Object.values(checkAction).filter(Boolean);
		}
		return [];
	}, [actionBtn, getPermission]);

	return (
		<List.Item
			actions={[
				<Space size={5} key='btn-action'>
					{checkRoleBtn.map((item, i) => React.cloneElement(item, { key: i }))}
				</Space>,
			]}
		>
			<List.Item.Meta
				avatar={<Avatar size={50} src={item.imageUrl} icon={!item.imageUrl ? <UserOutlined /> : null} />}
				title={_.startCase(`${item.firstName} ${item.lastName}`)}
				description={
					<Space
						size={5}
						align='center'
						split={<Divider type='vertical' style={{ borderInlineStart: `2px solid ${token.colorTextDisabled}` }} />}
					>
						<Flex align='center' gap={5}>
							<LinkOutlined />
							<span>{item.username || '-'}</span>
						</Flex>
						<Flex align='center' gap={5}>
							<MailOutlined />
							<span>{item.email || '-'}</span>
						</Flex>
						<Flex align='center' gap={5}>
							<IdcardOutlined />
							<span>{_.startCase(item.role || '-')}</span>
						</Flex>
					</Space>
				}
			/>
		</List.Item>
	);
}
