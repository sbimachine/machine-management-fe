import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';

import Layout from '@/components/layouts';
import AbsensiMain from '@/components/pages/absensi/AbsensiMain';
import SessionProvider from '@/components/providers/SessionProvider';

export const metadata = {
	title: 'Absensi',
	description: 'Halaman Absensi',
};

export default async function Absensi() {
	const session = await auth();
	const role = session?.user?.role;

	if (role === 'supervisior') return redirect('/mesin');
	if (role === 'produksi') return redirect('/mesin');
	if (role === 'leader') return redirect('/perbaikan');
	return (
		<SessionProvider session={session}>
			<Layout>
				<AbsensiMain />
			</Layout>
		</SessionProvider>
	);
}
