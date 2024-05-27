import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';

import Layout from '@/components/layouts';
import TeknisiMain from '@/components/pages/teknisi/TeknisiMain';
import SessionProvider from '@/components/providers/SessionProvider';

export const metadata = {
	title: 'Data Teknisi',
	description: 'List Data Teknisi',
};

export default async function Teknisi() {
	const session = await auth();
	const role = session?.user?.role;

	if (role === 'teknisi') redirect('/absensi');
	if (role === 'produksi') redirect('/mesin');
	return (
		<SessionProvider session={session}>
			<Layout>
				<TeknisiMain />
			</Layout>
		</SessionProvider>
	);
}
