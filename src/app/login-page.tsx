'use client';

import { gql, useMutation } from '@apollo/client';
import { LoginForm } from '../components/login-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CustomGQLErrorCode } from '../apollo/types';
import { client } from '@/apollo/client';

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
	const [login] = useMutation(LOGIN);
	const router = useRouter();
	const [gqlError, setGQLError] = useState<undefined | GQLError>();

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
							client.resetStore().then(() => {
								router.push('/dashboard');
							});
						})
						.catch((lodingError) => {
							setGQLError({
								message: lodingError.graphQLErrors[0].message,
								// @ts-ignore
								code: getCustomGQLErrorCode(
									lodingError.graphQLErrors[0]?.extensions?.code,
								),
							});
						});
				}}
				outlineInputs={
					!!gqlError && gqlError.code === CustomGQLErrorCode.AuthenticationError
				}
			/>
			{gqlError ? (
				<div className="form-message-error">{gqlError.message}</div>
			) : (
				''
			)}
		</div>
	);
};
