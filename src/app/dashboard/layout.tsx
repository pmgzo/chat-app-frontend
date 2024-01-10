'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Auth } from './Auth';
import { client } from '../../apollo/client';
import { ApolloProvider } from '@apollo/client';
import StoreProvider from '../StoreProvider';
import { useAppSelector } from '@/lib/hooks';
import Notification from './Notification';

function DashboardRendering({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	const notificationText = useAppSelector((state) => state.notification.text);
	const notificationStatus = useAppSelector(
		(state) => state.notification.status,
	);

	return (
		<section className="bg-white">
			<div className="absolute right-5 mt-5">
				<Notification status={notificationStatus} text={notificationText} />
			</div>
			<div className="w-full">
				<div className="ml-5 mt-5 grid grid-cols-3 w-[15rem]">
					<h2 className="text-black text-lg hover:font-bold rounded-xl p-2">
						<Link href="/dashboard/chats">Chats</Link>
					</h2>
					<h2 className="text-black text-lg hover:font-bold rounded-xl p-2">
						<Link href="/dashboard/friends">Friends</Link>
					</h2>
					<button
						className="text-black text-lg hover:bg-black hover:text-white rounded-xl p-2 ml-1"
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
		<StoreProvider>
			<Auth>
				<ApolloProvider client={client}>
					<DashboardRendering>{children}</DashboardRendering>
				</ApolloProvider>
			</Auth>
		</StoreProvider>
	);
}
