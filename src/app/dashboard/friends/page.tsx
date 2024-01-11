'use client';

import { Suspense } from 'react';
import Loading from '../../loading';
import FriendSuggestions from './suggestions';
import FriendRequests from './requests';
import FriendList from './list';
import { ErrorBoundary } from 'react-error-boundary';

export default function Page() {
	return (
		<div className="w-full">
			<ErrorBoundary fallback={<div>Couldn't load friend page</div>}>
				<Suspense fallback={<Loading />}>
					{/* pending friend request */}
					<div className="ml-3 grid grid-cols-3 gap-1 w-[50rem]">
						<FriendList />
						<FriendSuggestions />
						<FriendRequests />
					</div>
				</Suspense>
			</ErrorBoundary>
		</div>
	);
}
