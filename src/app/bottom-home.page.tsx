import { useState } from 'react';
import { LoginPage } from './login-page';
import { SignUpPage } from './signup-page';

enum ConnextionType {
	Login,
	Signup,
}

export const BottomHomePage: React.FunctionComponent<{}> = () => {
	const [connexionType, setConnexionType] = useState(ConnextionType.Login);

	return (
		<div>
			<div className="flex flex-row-reverse mr-10">
				<button
					className="text-black p-2 hover:bg-black hover:text-white hover:rounded-xl hover:p-2"
					onClick={() =>
						setConnexionType(
							connexionType === ConnextionType.Signup
								? ConnextionType.Login
								: ConnextionType.Signup,
						)
					}
				>
					{connexionType === ConnextionType.Login ? 'Sign up' : 'Login'}
				</button>
			</div>
			<div className="grid justify-items-center w-full">
				{connexionType === ConnextionType.Login ? (
					<LoginPage />
				) : (
					<SignUpPage />
				)}
			</div>
		</div>
	);
};
