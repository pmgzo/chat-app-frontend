'use client';

import { Suspense } from 'react';
import Loading from '../../loading';
import Conversations from './conversations';

export default function Page() {
	return (
		<div className="w-full">
			<div className="flex justify-center">
				<h3 className="text-black bg-white"> Chats Page </h3>
			</div>
			{/* <Suspense fallback={<Loading />}>
				<Conversations />
			</Suspense> */}
		</div>
	);
}
