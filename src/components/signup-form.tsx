import { useForm, Resolver } from 'react-hook-form';

type SignUpValues = {
	username: string;
	password: string;
	confirmedPassword: string;
};

export type SignUpFormArgs = {
	submit: (data: SignUpValues) => void;
};

const resolver: Resolver<SignUpValues> = async (values) => {
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

	errors = {
		...(values.confirmedPassword === ''
			? {
					password: {
						type: 'required',
						message: 'This is required.',
					},
				}
			: {}),
		...errors,
	};

	errors = {
		...(values.password !== '' &&
		values.confirmedPassword !== '' &&
		values.confirmedPassword !== values.password
			? {
					password: {
						type: 'required',
						message: 'Both passwords should match',
					},
					confirmedPassword: {
						type: 'required',
						message: 'Both passwords should match',
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

export const SignUpForm: React.FunctionComponent<SignUpFormArgs> = ({
	submit,
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpValues>({ resolver });
	const onSubmit = handleSubmit(submit);

	return (
		<div className="grid justify-items-center w-3/12 h-80 rounded-3xl bg-[#E4ABFF]">
			<h4 className="text-black mt-10 text-3xl">Sign up</h4>

			<form onSubmit={onSubmit} className="flex flex-col">
				<div className="grid justify-center justify-between">
					<input
						className="login-input"
						{...register('username')}
						placeholder="Username"
					/>
					{errors?.username && (
						<p className="text-red-600">{errors.username.message}</p>
					)}

					<input
						className="login-input"
						type="password"
						{...register('password')}
						placeholder="Password"
					/>
					{errors?.password && (
						<p className="text-red-600">{errors.password.message}</p>
					)}

					<input
						className="login-input"
						type="password"
						{...register('confirmedPassword')}
						placeholder="Confirm password"
					/>
					{errors?.confirmedPassword && (
						<p className="text-red-600">{errors.confirmedPassword.message}</p>
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
