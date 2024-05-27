import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
	const session = await auth();
	const role = session?.user?.role;

	if (role === 'supervisior') return redirect('/mesin');
	if (role === 'leader') return redirect('/perbaikan');
	if (role === 'produksi') return redirect('/mesin');
	return redirect('/absensi');
}
