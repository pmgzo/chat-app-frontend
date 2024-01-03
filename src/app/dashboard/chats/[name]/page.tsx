'use client';

import Loading from '@/app/loading';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Conversation from './conversation';

export default function Page({ params }: { params: { name: string } }) {
	const searchParams = useSearchParams();
	const peerId = searchParams.get('peerId');
	const conversationId = searchParams.get('conversationId');

	return (
		<div className="">
			<div className="text-xl flex justify-center w-5/6 my-5">
				{params.name}
			</div>
			<Suspense fallback={<Loading />}>
				<Conversation
					conversationId={Number(conversationId)}
					peerId={Number(peerId)}
				/>
			</Suspense>
		</div>
	);
}
