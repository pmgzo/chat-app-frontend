'use client';

import { Suspense } from 'react';
import Loading from '../../loading';
import Conversations from './conversations';
import UncreatedConversations from './uncreatedConversations';
import { ErrorBoundary } from 'react-error-boundary';

export default function Page() {
	return (
		<div className="w-full">
			<h3 className="text-black bg-white text-center w-full"> Chats Page </h3>
			<ErrorBoundary fallback={<div>Couldn't load conversations</div>}>
				<Suspense fallback={<Loading />}>
					<Conversations />
					<UncreatedConversations />
				</Suspense>
			</ErrorBoundary>
		</div>
	);
}
