import { useForm, Resolver } from 'react-hook-form';

type LoginFormValues = {
	username: string;
	password: string;
};

export type LoginFormArgs = {
	submit: (data: LoginFormValues) => void;
};

const resolver: Resolver<LoginFormValues> = async (values) => {
	let errors = {};

	console.log(values.username);
	console.log(null);

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
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({ resolver });
	const onSubmit = handleSubmit(submit);

	return (
		<div className="grid justify-items-center border-2 border-black w-3/12 h-80 rounded-3xl">
			<h4 className="text-black mt-10 text-3xl">Login</h4>

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
				</div>
				<input
					className="border-black border-2 text-black rounded-xl max-w-xl hover:bg-black hover:text-white m-2"
					type="submit"
					value="Submit"
				/>
			</form>
		</div>
	);
};
