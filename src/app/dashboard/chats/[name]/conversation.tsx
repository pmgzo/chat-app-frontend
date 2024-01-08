import { OnDataOptions, gql, useMutation, useSubscription, useSuspenseQuery } from '@apollo/client';
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
	text: string,
	messageJustSent: boolean 
}

export const ScrollableComponent: React.FunctionComponent<{
	// children: ReactNode | JSX.Element;
	fetchMore: ({ variables }: { variables: any }) => Promise<any>,
	count: number,
	step: number,
	unchangedVariables: Object | null,
	startData: Array<any>,
	peerId: number,
	conversationId: number
}> = ({ fetchMore, count, step, unchangedVariables, startData, peerId, conversationId }) => {

	const [data, setData] = useState<Array<any>>(startData);
	const [skip, setSkip] = useState(0);
	const outerDiv = useRef(null);
	const [message, setMessage] = useState<TypedMessageType>({text: '', messageJustSent: false});

	const [receivedMessage, setReceivedMessage] = useState<any | null>(null);

	const [
		sendMessage,
	{ error: createMessageDataError },
	] = useMutation(SEND_MESSAGE);

	// TODO: to replace by the right type
	function onData(options: OnDataOptions<any>) {
		setReceivedMessage(options.data.data.messageSent)
	}

	const { error: subscriptionMessageError } = useSubscription(
		MESSAGE_SUBSCRIPTION,
		{ variables: { receiverId: 1, conversationId } , onData}
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
					setData((oldData) => [createMessageData.data.sendMessage, ...oldData])
					setMessage({text: '', messageJustSent: true});
				});
			}
		}
	};

	useEffect(() => {
		if (receivedMessage) {
			setData((oldData) => [receivedMessage, ...oldData])
			setReceivedMessage(null)
		} 
		if (data.length === step || message.messageJustSent) {
			outerDiv.current.scrollTo({
				left: 0,
				top: outerDiv.current.scrollHeight - outerDiv.current.clientHeight,
				behavior: "smooth"
			})
		}
		if (message.messageJustSent) {
			setMessage({text: '', messageJustSent: false});
		}
	}, [data, message, receivedMessage]);

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
		const { scrollTop } = event.target;

		if (scrollTop === 0 && data.length < count) {
			loadScroll();
		}
	}

	return (
		<>
			<div
				ref={outerDiv}
				className="relative overflow-y-scroll bg-gray-50 h-full w-5/6"
				onScroll={handleScroll}
			>
				<ul className="">
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
						setMessage({text: event.target.value, messageJustSent: false});
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
