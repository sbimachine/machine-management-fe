import { theme } from '@/themes';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: { template: '%s | Machine Repairment System', default: 'Loading | Machine Repairment System' },
	description: 'Machine Repairment System',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className={inter.className} style={{ minHeight: '100vh', padding: 0, margin: 0 }}>
				<AntdRegistry>
					<ConfigProvider theme={theme}>{children}</ConfigProvider>
				</AntdRegistry>
			</body>
		</html>
	);
}
