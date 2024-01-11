import { useState } from 'react';
import { useForm, Resolver } from 'react-hook-form';

type LoginFormValues = {
	username: string;
	password: string;
};

export type LoginFormArgs = {
	submit: (data: LoginFormValues) => void;
	outlineInputs: boolean;
};

const resolver: Resolver<LoginFormValues> = async (values) => {
	let errors = {};

	errors = {
		...(values.username === ''
			? {
					username: {
						type: 'required',
						message: 'This is required.',
					},
				}
			: {}),
		...errors,
	};
	errors = {
		...(values.password === ''
			? {
					password: {
						type: 'required',
						message: 'This is required.',
					},
				}
			: {}),
		...errors,
	};

	return {
		values: values.username && values.password ? values : {},
		errors,
	};
};

export const LoginForm: React.FunctionComponent<LoginFormArgs> = ({
	submit,
	outlineInputs,
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({ resolver });
	const onSubmit = handleSubmit(submit);

	const [outlined, setOutline] = useState<boolean | undefined>(false);
	if (!outlined && outlineInputs) {
		setOutline(true);
	}

	return (
		<div className="grid justify-items-center bg-[#E4ABFF] w-3/12 h-80 rounded-3xl">
			<h4 className="text-black mt-10 text-3xl">Login</h4>

			<form onSubmit={onSubmit} className="flex flex-col">
				<div className="grid justify-center justify-between">
					<input
						className={`${
							outlineInputs
								? 'login-input outline outline-2 outline-red-600'
								: 'login-input placeholder-gray-700'
						}`}
						{...register('username')}
						placeholder="Username"
					/>
					{errors?.username && (
						<p className="text-red-600">{errors.username.message}</p>
					)}

					<input
						className={
							outlineInputs
								? 'outline outline-2 outline-red-600 login-input placeholder-gray-700'
								: 'login-input placeholder-gray-700'
						}
						type="password"
						{...register('password')}
						placeholder="Password"
					/>
					{errors?.password && (
						<p className="text-red-600">{errors.password.message}</p>
					)}
				</div>
				<input
					className="bg-[#DC93FF] text-black rounded-xl max-w-xl hover:text-white focus:outline focus:border focus:outline-transparent focus:border-transparent m-2"
					type="submit"
					value="Submit"
				/>
			</form>
		</div>
	);
};
