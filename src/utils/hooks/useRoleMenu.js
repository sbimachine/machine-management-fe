import roles from '@/roles';
import { useSession } from 'next-auth/react';
import * as React from 'react';

export function useRoleMenu() {
	const { data: session } = useSession();

	const menu = React.useMemo(() => {
		const role = session?.user?.role;
		return roles[role];
	}, [session]);

	const getPermission = React.useCallback((path) => menu?.find((menu) => menu.menu === path)?.permission, [menu]);

	return { menu, getPermission };
}
