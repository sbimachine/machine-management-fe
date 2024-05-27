/* eslint-disable @next/next/no-img-element */
import { useStore } from '@/states';
import { useRoleMenu } from '@/utils/hooks';
import { parseDate, parseFormFile } from '@/utils/parse';
import * as React from 'react';

import KategoriMesinTags from '@/components/flags/KategoriMesinTags';
import StatusMesinTags from '@/components/flags/StatusMesinTags';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, Col } from 'antd';

export default function MesinCard({ mesin }) {
	const { setMesin } = useStore();
	const { getPermission } = useRoleMenu();

	const onSetData = React.useCallback(
		(type) => {
			const { buyDate, imageUrl, status, ...fields } = mesin;
			const files = parseFormFile({ image: { urls: [imageUrl], filename: fields.machineName } });
			const data = { buyDate: parseDate(buyDate, true), ...fields, ...files };
			setMesin({
				formType: type,
				selectedData: ['show', 'delete'].includes(type) ? mesin : data,
				modalShowVisible: type === 'show',
				modalUpdateVisible: type === 'update',
				modalDeleteVisible: type === 'delete',
			});
		},
		[mesin, setMesin]
	);

	const actionBtn = React.useMemo(
		() => ({
			show: <BtnCard icon={<EyeOutlined />} key='show' onClick={() => onSetData('show')} />,
			edit: <BtnCard icon={<EditOutlined />} key='edit' onClick={() => onSetData('update')} />,
			delete: <BtnCard icon={<DeleteOutlined />} key='delete' onClick={() => onSetData('delete')} />,
		}),
		[onSetData]
	);

	const checkRoleBtn = React.useMemo(() => {
		const permission = getPermission('/mesin');
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
		<Col span={6}>
			<Card
				styles={{ cover: { height: 100 } }}
				cover={
					<img
						alt='example'
						src={mesin.imageUrl}
						style={{ objectFit: 'cover', objectPosition: 'center top', height: 100 }}
					/>
				}
				actions={checkRoleBtn}
			>
				<Card.Meta
					title={mesin.machineName}
					description={
						<>
							<KategoriMesinTags value={mesin.categoryId} />
							<StatusMesinTags value={mesin.status} />
						</>
					}
				/>
			</Card>
		</Col>
	);
}

function BtnCard({ icon, ...props }) {
	return (
		<Button
			type='ghost'
			shape='circle'
			icon={React.cloneElement(icon, { style: { fontSize: 14 }, key: props.key })}
			{...props}
		/>
	);
}
