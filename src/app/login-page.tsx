'use client';

import { gql, useMutation } from '@apollo/client';
import { LoginForm } from '../components/login-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LOGIN = gql`
	mutation Login($credentials: UserCredentialsInput!) {
		login(credentials: $credentials) {
			token
		}
	}
`;

export const LoginPage: React.FunctionComponent<{}> = () => {
	const [login, { error }] = useMutation(LOGIN);
	const router = useRouter();
	const [gqlError, setGQLError] = useState<undefined | string>();

	if (error && !gqlError) {
		setGQLError(error!.message);
	}

	return (
		<div className="grid justify-items-center w-full">
			<LoginForm
				submit={(inputData) => {
					setGQLError(undefined);
					login({
						variables: {
							credentials: {
								name: inputData.username,
								password: inputData.password,
							},
						},
					})
						.then((resMutation) => {
							console.log(resMutation.data.login.token);
							sessionStorage.setItem('Token', resMutation.data.login.token);
							router.push('/dashboard');
						})
						.catch((err) => {
							console.log(err);
						});
				}}
			/>
			{gqlError ? <div className="text-black">{gqlError}</div> : ''}
		</div>
	);
};
