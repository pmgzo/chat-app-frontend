'use client';

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

	return (
		<div className="w-50">
			<ul className="flex justify-start">
				{/*@ts-ignore*/}
				{data.uncreatedConversations.map(
					({
						id: friendshipId,
						peer: { name },
					}: {
						id: number;
						peer: { name: string };
					}) => (
						<li className="p-2">
							<button
								onClick={() => {
									createConversation({
										variables: { friendshipId, limitMessages: 10 },
									}).then((receivedData) => {
										const peerId = receivedData.data.createConversation.peer.id;
										const conversationId =
											receivedData.data.createConversation.id;
										// push parameter to new routes ?
										router.push(
											`chats/${name}?conversationId=${conversationId}?peerId=${peerId}`,
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
