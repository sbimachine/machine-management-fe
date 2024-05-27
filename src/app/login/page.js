import LoginForm from '@/components/pages/login/LoginForm';
import { Flex } from 'antd';

export const metadata = {
	title: 'Login',
	description: 'Login page',
};

export default function Login() {
	return (
		<Flex justify='center' align='center' style={{ backgroundColor: '#001529', minHeight: '100vh' }}>
			<LoginForm />
		</Flex>
	);
}
