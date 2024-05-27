'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

export default function QueryProvider({ children }) {
	const [queryClient] = React.useState(() => new QueryClient({ defaultOptions: { queries: { retry: true } } }));

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
