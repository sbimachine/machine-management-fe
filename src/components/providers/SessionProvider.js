'use client';

import * as React from 'react';
import { SessionProvider as SessionProviderAuth } from 'next-auth/react';

export default function SessionProvider({ children, session }) {
	return <SessionProviderAuth session={session}>{children}</SessionProviderAuth>;
}
