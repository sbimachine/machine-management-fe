import { auth } from '@/utils/auth';

import Layout from '@/components/layouts';
import BiodataDetail from '@/components/pages/biodata/BiodataDetail';
import SessionProvider from '@/components/providers/SessionProvider';
import { Flex } from 'antd';

export const metadata = {
	title: 'Biodata',
	description: 'Halaman Biodata',
};

export default async function Biodata() {
	const session = await auth();

	return (
		<SessionProvider session={session}>
			<Layout>
				<Flex vertical gap={20}>
					<h2 style={{ margin: 0 }}>Biodata</h2>
					<BiodataDetail />
				</Flex>
			</Layout>
		</SessionProvider>
	);
}
