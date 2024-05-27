import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';

import Layout from '@/components/layouts';
import HasilPerbaikanMain from '@/components/pages/hasilPerbaikan/HasilPerbaikanMain';
import SessionProvider from '@/components/providers/SessionProvider';

export const metadata = {
	title: 'Laporan Hasil Perbaikan Mesin',
	description: 'List Hasil Perbaikan Mesin',
};

export default async function HasilPerbaikan() {
	const session = await auth();
	const role = session?.user?.role;

	if (role === 'produksi') return redirect('/mesin');
	if (role === 'teknisi') return redirect('/absensi');
	return (
		<SessionProvider session={session}>
			<Layout>
				<HasilPerbaikanMain />
			</Layout>
		</SessionProvider>
	);
}
