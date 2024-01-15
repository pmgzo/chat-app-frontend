'use client';

import { Suspense } from 'react';
import Loading from '../../loading';
import Conversations from './conversations';
import UncreatedConversations from './uncreatedConversations';
import { ErrorBoundary } from 'react-error-boundary';

export default function Page() {
	return (
		<div className="w-full">
			<ErrorBoundary fallback={<div>Couldn&apos;t load conversations</div>}>
				<Suspense fallback={<Loading />}>
					<div className="ml-3">
						<Conversations />
						<UncreatedConversations />
					</div>
				</Suspense>
			</ErrorBoundary>
		</div>
	);
}
