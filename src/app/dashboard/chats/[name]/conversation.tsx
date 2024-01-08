import {
	OnDataOptions,
	gql,
	useMutation,
	useSubscription,
	useSuspenseQuery,
} from '@apollo/client';
import { KeyboardEventHandler, useEffect, useRef, useState } from 'react';

const GET_CONV = gql`
	query GetConv($id: Int!, $skip: Int, $take: Int) {
		conversation(id: $id) {
			id
			count
			messages(take: $take, skip: $skip) {
				id
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
			id
			senderId
			text
		}
	}
`;

const MESSAGE_SUBSCRIPTION = gql`
	subscription OnMessageSent($conversationId: Int!, $receiverId: Int!) {
		messageSent(conversationId: $conversationId, receiverId: $receiverId) {
			id
			senderId
			text
		}
	}
`;

interface TypedMessageType {
	text: string;
	messageJustSent: boolean;
}

interface ReceivedMessagesType {
	unseenMessages: number;
	// changes with type of message
	messages: Array<any>;
}

export const ScrollableComponent: React.FunctionComponent<{
	fetchMore: ({ variables }: { variables: any }) => Promise<any>;
	count: number;
	step: number;
	unchangedVariables: Object | null;
	startData: Array<any>;
	peerId: number;
	conversationId: number;
}> = ({
	fetchMore,
	count,
	step,
	unchangedVariables,
	startData,
	peerId,
	conversationId,
}) => {
	const [data, setData] = useState<Array<any>>(startData);
	const [skip, setSkip] = useState(0);
	const outerDiv = useRef(null);
	const [message, setMessage] = useState<TypedMessageType>({
		text: '',
		messageJustSent: false,
	});

	const [receivedMessages, setReceivedMessages] =
		useState<ReceivedMessagesType>({ unseenMessages: 0, messages: [] });

	const [sendMessage, { error: createMessageDataError }] =
		useMutation(SEND_MESSAGE);

	// TODO: to replace by the right type
	function onData(options: OnDataOptions<any>) {
		setReceivedMessages((currentData) => ({
			unseenMessages: currentData.unseenMessages + 1,
			messages: [options.data.data.messageSent, ...currentData.messages],
		}));
	}

	const { error: subscriptionMessageError } = useSubscription(
		MESSAGE_SUBSCRIPTION,
		{ variables: { receiverId: 1, conversationId }, onData },
	);

	const onEnter: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
		if (event.key === 'Enter' && event.shiftKey == false) {
			const trimmedMessage = message.text.trim();
			if (trimmedMessage) {
				sendMessage({
					variables: {
						messageInput: {
							conversationId,
							receiverId: peerId,
							text: trimmedMessage,
						},
					},
				}).then((createMessageData) => {
					setData((currentData) => [
						createMessageData.data.sendMessage,
						...currentData,
					]);
					setMessage({ text: '', messageJustSent: true });
				});
			}
		}
	};

	useEffect(() => {
		if (receivedMessages.messages.length) {
			// ref.current = receivedMessages.unseenMessages;
			setData((oldData) => [...receivedMessages.messages, ...oldData]);
			setReceivedMessages((currentData) => ({ ...currentData, messages: [] }));
		}
		if (data.length === step || message.messageJustSent) {
			outerDiv.current.scrollTo({
				left: 0,
				top: outerDiv.current.scrollHeight - outerDiv.current.clientHeight,
				behavior: 'smooth',
			});
		}
		if (message.messageJustSent) {
			setMessage({ text: '', messageJustSent: false });
		}
	}, [data, message, receivedMessages]);

	function loadScroll() {
		const newSkip = skip + step;
		fetchMore({
			variables: { take: step, skip: newSkip, ...(unchangedVariables || {}) },
		}).then((data2) => {
			setData((oldData) => [...oldData, ...data2.data.conversation.messages]);
			setSkip(newSkip);
		});
	}

	function handleScroll(event: any) {
		const { scrollTop, scrollHeight, clientHeight } = event.target;

		if (scrollTop === 0 && data.length < count) {
			// if try to scroll on top, load previous messages
			loadScroll();
		}
		if (scrollTop === scrollHeight - clientHeight) {
			// reset seen messages
			setReceivedMessages((currentData) => ({
				...currentData,
				unseenMessages: 0,
			}));
		}
	}

	return (
		<>
			<div className="bg-gray-50 w-5/6 h-[25rem] flex flex-col-reverse">
				{receivedMessages.unseenMessages !== 0 ? (
					<div className="absolute w-5/6 bg-gray-100 text-black z-10 flex justify-center">{`You have ${receivedMessages.unseenMessages} unread message(s)`}</div>
				) : (
					''
				)}

				<ul
					ref={outerDiv}
					className="child h-full relative overflow-y-scroll"
					onScroll={handleScroll}
				>
					{/* @ts-ignore */}
					{data
						.map(
							({
								text,
								senderId,
								id,
							}: {
								text: string;
								senderId: number;
								id: number;
							}) =>
								senderId == peerId ? (
									<div
										key={String(id)}
										className="flex flex-row-reverse max-w-3/6 mb-2 mr-2"
									>
										<li className="bg-gray-200 p-2 rounded-xl">{text}</li>
									</div>
								) : (
									<div
										key={String(id)}
										className="flex flex-start max-w-3/6 mb-2 ml-2"
									>
										<li className="bg-[#E4ABFF] text-black p-2  rounded-xl">
											{text}
										</li>
									</div>
								),
						)
						.reverse()}
				</ul>
			</div>

			<div className="flex flex-start">
				<textarea
					className="border-4 border-black p-2 max-w-100"
					value={message.text}
					name="message"
					onChange={(event) => {
						setMessage({ text: event.target.value, messageJustSent: false });
					}}
					onKeyDown={onEnter}
				/>
			</div>
		</>
	);
};

export default function Conversation({
	conversationId,
	peerId,
}: {
	conversationId: number;
	peerId: number;
}) {
	const step = 10;
	const { error, data, fetchMore } = useSuspenseQuery(GET_CONV, {
		variables: { id: conversationId, take: step },
	});

	const { count, messages: startData } = data.conversation;

	return (
		<div className="flex flex-col">
			<div className="h-[25rem]">
				<ScrollableComponent
					fetchMore={fetchMore}
					count={count}
					step={step}
					unchangedVariables={{ id: conversationId }}
					startData={startData}
					peerId={peerId}
					conversationId={conversationId}
				/>
			</div>
		</div>
	);
}
