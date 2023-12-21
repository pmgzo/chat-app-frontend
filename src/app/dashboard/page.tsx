'use client';

import { Auth } from './auth';

const PageRendering: React.FunctionComponent<{}> = () => {
	return <div>You're connected !</div>;
};

export default function Page() {
	return (
		<Auth>
			<PageRendering />
		</Auth>
	);
}
