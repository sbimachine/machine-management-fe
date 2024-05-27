import { api } from '@/utils/api';
import { jwtDecode } from 'jwt-decode';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const authConfig = {
	providers: [
		Credentials({
			name: 'Credentials',
			credentials: {},
			async authorize(credentials) {
				try {
					const results = await api.post('/auth/login', credentials);
					if (!results.data.data) return null;
					return results.data.data;
				} catch (err) {
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user, session, trigger }) {
			if (trigger === 'signIn' && user?.token) {
				const { exp, iat, iss, ...decodedToken } = jwtDecode(user.token);
				const tokens = { token: user.token, refreshToken: user.refreshToken };
				Object.assign(token, { ...decodedToken, ...tokens });
			} else if (trigger === 'update' && session.user?.token) {
				const { exp, iat, iss, ...decodedToken } = jwtDecode(session.user.token);
				const tokens = { token: session.user.token, refreshToken: session.user.refreshToken };
				Object.assign(token, { ...decodedToken, ...tokens });
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				const { sub, exp, iat, jti, ...decodedToken } = token;
				Object.assign(session.user, decodedToken);
			}
			return session;
		},
		authorized({ auth, request }) {
			const { nextUrl } = request;
			const isLoggedIn = !!auth?.user;
			const isOnLogin = nextUrl.pathname === '/login';

			if (isOnLogin) {
				if (isLoggedIn) return Response.redirect(new URL('/', nextUrl));
				return true;
			} else {
				if (isLoggedIn) return true;
				return false;
			}
		},
	},
	session: { strategy: 'jwt' },
	pages: { signIn: '/login' },
};

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth(authConfig);
