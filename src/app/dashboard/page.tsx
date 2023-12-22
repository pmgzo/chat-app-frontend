'use client';

import { redirect } from 'next/navigation';
import { Auth } from './auth';
import { useEffect, useState } from 'react';

const PageRendering: React.FunctionComponent<{}> = () => {
	const [loggedOut, setLoggedOut] = useState(false);

	useEffect(() => {
		if (loggedOut) {
			sessionStorage.removeItem('Token');
			redirect('/');
		}
		return () => {};
	}, [loggedOut]);

	return (
		<div className="bg-white">
			<div className="flex flex-row-reverse mr-10">
				<button
					className="text-black p-2 hover:bg-black hover:text-white hover:rounded-xl hover:p-2"
					onClick={() => setLoggedOut(true)}
				>
					Logout
				</button>
			</div>
			<div className="text-black">You're connected !</div>
		</div>
	);
};

export default function Page() {
	return (
		<Auth>
			<PageRendering />
		</Auth>
	);
}
