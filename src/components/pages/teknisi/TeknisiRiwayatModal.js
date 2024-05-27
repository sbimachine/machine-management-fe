import { useStore } from '@/states';

import PenugasanDetailModal from '@/components/pages/penugasan/PenugasanDetailModal';
import TeknisiRiwayatTable from '@/components/pages/teknisi/TeknisiRiwayatTable';
import { Flex, Modal } from 'antd';

export default function TeknisiRiwayatModal() {
	const { teknisi, setTeknisi } = useStore();

	const onCancel = () => {
		setTeknisi({
			modalShowVisible: false,
			modalAddVisible: false,
			modalUpdateVisible: false,
			modalDeleteVisible: false,
			selectedData: null,
			formType: 'add',
		});
	};

	return (
		<Modal
			title='Detail Riwayat Perbaikan Teknisi'
			open={teknisi.modalShowVisible}
			onCancel={onCancel}
			width={800}
			footer={null}
			centered
		>
			<Flex style={{ padding: '10px 0' }} gap={20} vertical>
				<TeknisiRiwayatTable />
			</Flex>

			<PenugasanDetailModal />
		</Modal>
	);
}
