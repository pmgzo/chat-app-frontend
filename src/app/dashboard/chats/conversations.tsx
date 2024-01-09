'use client';

import {
	NotificationStatus,
	popNotification,
} from '@/lib/features/notification/notificationSlice';
import { useAppDispatchWithResetState } from '@/lib/hooks';
import { gql, useSuspenseQuery } from '@apollo/client';
import Link from 'next/link';

const GET_CONVS = gql`
	query GetConvs($take: Int!) {
		conversations {
			id
			friendshipId
			count
			messages(take: $take) {
				senderId
				text
			}
			peer {
				id
				name
			}
		}
	}
`;

export default function Conversations() {
	const { error, data } = useSuspenseQuery(GET_CONVS, {
		variables: { take: 2 },
	});

	// const dispatch = useAppDispatchWithResetState()

	// if (error) {
	// 	dispatch(popNotification({text: error.graphQLErrors[0].message, status: NotificationStatus.Error}))
	// }

	return (
		<div className="w-50">
			{'Conversations:'}
			{/**@ts-ignore */}
			{data.conversations?.length ? (
				<ul className="flex justify-start">
					{/*@ts-ignore*/}
					{data.conversations.map(
						/*@ts-ignore*/
						({ id: conversationId, messages, peer: { id: peerId, name } }) => (
							<li key={peerId} className="p-2">
								{/* Display messages here */}
								<Link
									href={{
										pathname: `chats/${name}`,
										query: { conversationId, peerId },
									}}
								>
									Conversation with {name}
								</Link>
							</li>
						),
					)}
				</ul>
			) : (
				'No conversations'
			)}
		</div>
	);
}
