import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';

import Layout from '@/components/layouts';
import MesinMain from '@/components/pages/mesin/MesinMain';
import SessionProvider from '@/components/providers/SessionProvider';

export const metadata = {
	title: 'Mesin',
	description: 'List Data Mesin',
};

export default async function Mesin() {
	const session = await auth();
	const role = session?.user?.role;

	if (role === 'leader') return redirect('/perbaikan');
	if (role === 'teknisi') return redirect('/absensi');
	return (
		<SessionProvider session={session}>
			<Layout>
				<MesinMain />
			</Layout>
		</SessionProvider>
	);
}
