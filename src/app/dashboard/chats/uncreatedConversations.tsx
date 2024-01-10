'use client';

import {
	NotificationStatus,
	popNotification,
} from '@/lib/features/notification/notificationSlice';
import { useAppDispatchWithResetState } from '@/lib/hooks';
import { gql, useMutation, useSuspenseQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';

const GET_UNCREATED_CONVS = gql`
	query GetUncreatedConv {
		uncreatedConversations {
			id
			peer {
				id
				name
			}
		}
	}
`;

const CREATE_CONVERSATION = gql`
	mutation CreateConv($friendshipId: Int!, $limitMessages: Int!) {
		createConversation(friendshipId: $friendshipId) {
			id
			count
			messages(take: $limitMessages) {
				text
				receiverId
			}
			peer {
				id
				name
			}
		}
	}
`;

export default function UncreatedConversations() {
	const router = useRouter();

	const { error, data } = useSuspenseQuery(GET_UNCREATED_CONVS, {
		variables: { limit: 2 },
	});
	const [
		createConversation,
		{ loading, error: createConversationError, data: createdConvData },
	] = useMutation(CREATE_CONVERSATION);

	const dispatchNotification = useAppDispatchWithResetState();

	return (
		<div className="ml-3 mt-10">
			<ul className="flex justify-start overflow-x-scroll">
				{/*@ts-ignore*/}
				{data.uncreatedConversations.map(
					({
						id: friendshipId,
						peer: { name },
					}: {
						id: number;
						peer: { name: string };
					}) => (
						<li className="flex flex-col justify-center w-[15rem] bg-[#E4ABFF] text-center p-4 rounded-xl hover:shadow-md">
							<button
								onClick={() => {
									createConversation({
										variables: { friendshipId, limitMessages: 10 },
									})
										.then((receivedData) => {
											const peerId =
												receivedData.data.createConversation.peer.id;
											const conversationId =
												receivedData.data.createConversation.id;
											router.push(
												`chats/${name}?conversationId=${conversationId}&peerId=${peerId}`,
											);
										})
										.catch((createConversationError) => {
											dispatchNotification(
												popNotification({
													text: 'Failed to create conversation',
													status: NotificationStatus.Error,
												}),
											);
										});
								}}
							>
								Start Conv with {name}
							</button>
						</li>
					),
				)}
			</ul>
		</div>
	);
}
