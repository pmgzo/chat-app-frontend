import { gql, useMutation, useSuspenseQuery } from '@apollo/client';
import { KeyboardEventHandler, useState } from 'react';

const GET_CONVS = gql`
	query GetConv($id: Int!, $skip: Int, $take: Int) {
		conversation(id: $id) {
			id
			count
			messages(take: $take, skip: $skip) {
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

const SEND_MESSAGE = gql`
	mutation SendMessage($messageInput: MessageInput!) {
		sendMessage(messageInput: $messageInput) {
			conversationId
			text
		}
	}
`;

export default function Conversation({
	conversationId,
	peerId,
}: {
	conversationId: number;
	peerId: number;
}) {
	const { error, data } = useSuspenseQuery(GET_CONVS, {
		variables: { id: conversationId, take: 5 },
	});
	const [
		sendMessage,
		{ loading, error: createConversationError, data: createdConvData },
	] = useMutation(SEND_MESSAGE);

	const [message, setMessage] = useState<string>('');

	const onEnter: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
		if (event.key === 'Enter' && event.shiftKey == false) {
			console.log(peerId);
			sendMessage({
				variables: {
					messageInput: {
						conversationId,
						receiverId: peerId,
						text: message,
					},
				},
			}).then(() => setMessage(''));
		}
	};

	return (
		<div>
			<ul className="bg-gray-50 w-5/6">
				{/* @ts-ignore */}
				{data.conversation.messages
					.map(({ text, senderId }: { text: string; senderId: number }) =>
						senderId == peerId ? (
							<div className="flex flex-start max-w-3/6 mb-2 ml-2">
								<li className="bg-gray-200 text-black p-2  rounded-xl">
									{text}
								</li>
							</div>
						) : (
							<div className="flex flex-row-reverse max-w-3/6 mb-2 mr-2">
								<li className="text-black bg-[#E4ABFF] p-2 rounded-xl">
									{text}
								</li>
							</div>
						),
					)
					.reverse()}
			</ul>

			<div className="flex flex-start">
				<textarea
					className="border-4 border-black p-2 max-w-100"
					value={message}
					name="message"
					onChange={(event) => {
						setMessage(event.target.value);
					}}
					onKeyDown={onEnter}
				/>
			</div>
		</div>
	);
}
