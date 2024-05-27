import axios from 'axios';
import { auth, unstable_update } from '@/utils/auth';
import { getCsrfToken, getSession } from 'next-auth/react';

const isServer = typeof window === 'undefined';
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({ baseURL: BASE_API_URL });

let isFetchedToken = false;
let subscribers = [];

const onAccessTokenFetched = (token) => {
	subscribers.forEach((callback) => callback(token));
	subscribers = [];
};

const addSubscriber = (callback) => {
	subscribers.push(callback);
};

const fetchSession = async () => {
	const session = isServer ? await auth() : await getSession();
	return session;
};

api.interceptors.request.use(
	async (request) => {
		const session = await fetchSession();
		if (session) request.headers.Authorization = `Bearer ${session.user.token}`;
		return request;
	},
	(err) => {
		return Promise.reject(err);
	}
);

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const { response } = error;
		if (
			[401, 403].includes(response.status) &&
			!response.config.url.includes('/refresh-token') &&
			!response.config.url.includes('/login')
		) {
			try {
				const retryOriginalRequest = new Promise((resolve) => {
					addSubscriber((token) => {
						response.config.headers.Authorization = `Bearer ${token}`;
						resolve(axios(response.config));
					});
				});

				if (!isFetchedToken) {
					isFetchedToken = true;
					const session = await fetchSession();
					const { token, refreshToken } = session.user;

					const headers = { 'refresh-token': refreshToken, Authorization: `Bearer ${token}` };
					const { data: user } = await api.get('/auth/refresh-token', { headers });
					const newUserData = { token: user.data.token, refreshToken: user.data.refreshToken };

					if (isServer) {
						await unstable_update({ user: newUserData });
					} else {
						const csrfToken = await getCsrfToken();
						await axios.post('/api/auth/session', { csrfToken, data: { user: newUserData } });
					}

					onAccessTokenFetched(user.data.token);
				}
				return retryOriginalRequest;
			} catch (error) {
				return Promise.reject(error);
			} finally {
				isFetchedToken = false;
			}
		}
		return Promise.reject(error);
	}
);
