'use client';

import Loading from '@/app/loading';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Conversation from './conversation';
import { ErrorBoundary } from 'react-error-boundary';

export default function Page({ params }: { params: { name: string } }) {
	const searchParams = useSearchParams();
	const peerId = searchParams.get('peerId');
	const conversationId = searchParams.get('conversationId');

	return (
		<div>
			<div className="text-xl flex justify-center w-[60rem] my-5">
				{params.name}
			</div>
			<ErrorBoundary fallback={<div>Couldn't load conversation</div>}>
				<Suspense fallback={<Loading />}>
					<Conversation
						conversationId={Number(conversationId)}
						peerId={Number(peerId)}
					/>
				</Suspense>
			</ErrorBoundary>
		</div>
	);
}
