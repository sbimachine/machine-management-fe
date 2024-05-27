import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';

import Layout from '@/components/layouts';
import PenugasanMain from '@/components/pages/penugasan/PenugasanMain';
import PerbaikanMain from '@/components/pages/perbaikan/PerbaikanMain';
import SessionProvider from '@/components/providers/SessionProvider';

export const metadata = {
	title: 'Laporan Perbaikan Mesin',
	description: 'List Perbaikan Mesin',
};

export default async function Perbaikan() {
	const session = await auth();
	const role = session?.user?.role;

	if (role === 'supervisior') return redirect('/mesin');
	return (
		<SessionProvider session={session}>
			<Layout>{session?.user?.role === 'teknisi' ? <PenugasanMain /> : <PerbaikanMain />}</Layout>
		</SessionProvider>
	);
}
