import { useStore } from '@/states';

import MesinDetail from '@/components/pages/mesin/MesinDetail';
import { Modal } from 'antd';

export default function MesinDetailModal() {
	const { mesin, setMesin } = useStore();

	const onCancel = () => {
		setMesin({
			modalShowVisible: false,
			modalAddVisible: false,
			modalUpdateVisible: false,
			modalDeleteVisible: false,
			selectedData: null,
			formType: 'add',
		});
	};

	return (
		<Modal title='Detail Mesin' open={mesin.modalShowVisible} onCancel={onCancel} width={400} footer={null} centered>
			<div style={{ paddingTop: 10 }}>
				<MesinDetail />
			</div>
		</Modal>
	);
}
