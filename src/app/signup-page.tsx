'use client';

import { gql, useMutation } from '@apollo/client';
import { SignUpForm } from '../components/signup-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SIGNUP = gql`
	mutation SignUp($credentials: UserCredentialsInput!) {
		createUser(credentials: $credentials) {
			token
		}
	}
`;

export const SignUpPage: React.FunctionComponent<{}> = () => {
	const [signup, { error }] = useMutation(SIGNUP);
	const router = useRouter();
	const [gqlError, setGQLError] = useState<undefined | string>();

	if (error && !gqlError) {
		setGQLError(error!.message);
	}

	return (
		<div className="grid justify-items-center w-full">
			<SignUpForm
				submit={(data) => {
					setGQLError(undefined);
					signup({
						variables: {
							credentials: { name: data.username, password: data.password },
						},
					})
						.then((resMutation) => {
							sessionStorage.setItem('Token', resMutation.data.login.token);

							router.push('/dashboard');
						})
						.catch((err) => {
							// to avoid error in the console
						});
				}}
			/>
			{gqlError ? <div className="form-message-error">{gqlError}</div> : ''}
		</div>
	);
};
