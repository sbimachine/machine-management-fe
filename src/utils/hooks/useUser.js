import { useSession } from 'next-auth/react';
import * as React from 'react';

export function useUser() {
	const { data: session } = useSession();
	const user = React.useMemo(() => session?.user, [session]);
	return user;
}
