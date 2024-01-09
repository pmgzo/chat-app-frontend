'use client';

import { Suspense } from 'react';
import Loading from '../../loading';
import Conversations from './conversations';
import UncreatedConversations from './uncreatedConversations';
import { ErrorBoundary } from 'react-error-boundary';

export default function Page() {
	return (
		<div className="w-full">
			<div className="flex justify-center">
				<h3 className="text-black bg-white"> Chats Page </h3>
			</div>
			<ErrorBoundary fallback={<div>Something went wrong</div>}>
				<Suspense fallback={<Loading />}>
					<Conversations />
					<UncreatedConversations />
				</Suspense>
			</ErrorBoundary>
		</div>
	);
}
