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
			<div className="flex justify-center">
				<h3 className="text-black bg-white"> Friends Page </h3>
			</div>
			<ErrorBoundary fallback={<div>Couldn't load friend page</div>}>
				<Suspense fallback={<Loading />}>
					{/* pending friend request */}
					<div className="flex flex-start">
						<FriendList />
						<FriendSuggestions />
						<FriendRequests />
					</div>
				</Suspense>
			</ErrorBoundary>
		</div>
	);
}
