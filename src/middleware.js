export { auth as middleware } from '@/utils/auth';

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
