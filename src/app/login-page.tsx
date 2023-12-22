'use client';

import { gql, useMutation } from '@apollo/client';
import { LoginForm } from '../components/login-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CustomGQLErrorCode } from '../apollo/types';

const LOGIN = gql`
	mutation Login($credentials: UserCredentialsInput!) {
		login(credentials: $credentials) {
			token
		}
	}
`;

interface GQLError {
	message: string;
	code?: CustomGQLErrorCode;
}

function getCustomGQLErrorCode(code?: string): CustomGQLErrorCode | undefined {
	if (!code) return undefined;
	if (
		Object.values(CustomGQLErrorCode).includes(
			code as unknown as CustomGQLErrorCode,
		)
	) {
		return code as unknown as CustomGQLErrorCode;
	}
}

export const LoginPage: React.FunctionComponent<{}> = () => {
	const [login, { error }] = useMutation(LOGIN);
	const router = useRouter();
	const [gqlError, setGQLError] = useState<undefined | GQLError>();

	if (error && !gqlError) {
		setGQLError({
			message: error!.message,
			// @ts-ignore
			code: getCustomGQLErrorCode(error.graphQLErrors[0]?.extensions?.code),
		});
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
							sessionStorage.setItem('Token', resMutation.data.login.token);
							router.push('/dashboard');
						})
						.catch((err) => {
							// to avoid error in the console
						});
				}}
				outlineInputs={!!gqlError && gqlError.code === CustomGQLErrorCode.AuthenticationError}
			/>
			{gqlError ? <div className="form-message-error">{gqlError.message}</div> : ''}
		</div>
	);
};
