'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Auth } from './auth';
import { client } from '../../apollo/client';
import { ApolloProvider } from '@apollo/client';

function DashboardRendering({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	return (
		<section className="bg-white">
			<div className="inline-flex w-full mt-2">
				<div className="inline-flex ml-5">
					<h2 className="text-black p-2">
						<Link href="/dashboard/chats">Chats</Link>
					</h2>
					<h2 className="text-black p-2">
						<Link href="/dashboard/friends">Friends</Link>
					</h2>
				</div>
				<div className="flex flex-row-reverse w-full mr-10">
					<button
						className="text-black p-2 hover:bg-black hover:text-white hover:rounded-xl hover:p-2"
						onClick={() => {
							client.clearStore().then(() => {
								sessionStorage.removeItem('Token');
								router.replace('/');
							});
						}}
					>
						Logout
					</button>
				</div>
			</div>
			{children}
		</section>
	);
}

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Auth>
			<ApolloProvider client={client}>
				<DashboardRendering>{children}</DashboardRendering>
			</ApolloProvider>
		</Auth>
	);
}
