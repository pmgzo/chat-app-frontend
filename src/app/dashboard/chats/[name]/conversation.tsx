import {
	NotificationStatus,
	popNotification,
} from '@/lib/features/notification/notificationSlice';
import { useAppDispatchWithResetState } from '@/lib/hooks';
import {
	ApolloError,
	OnDataOptions,
	gql,
	useMutation,
	useSubscription,
	useSuspenseQuery,
} from '@apollo/client';
import {
	KeyboardEventHandler,
	Reducer,
	useEffect,
	useReducer,
	useRef,
	useState,
} from 'react';

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
	subscription OnMessageSent($conversationId: Int!) {
		messageSent(conversationId: $conversationId) {
			id
			senderId
			text
		}
	}
`;

enum ConvEvent {
	SEND_MESSAGE = 1,
	LOAD_PREVIOUS_MESSAGES,
	RECEIVED_MESSAGE,
	RESET_UNSEEN_MESSAGES,
}

interface ConvActionType {
	type: ConvEvent;
	variables?: any;
}

interface StateConv {
	messages: Array<any>;
	previousScrollHeight?: number;
	skip: number;
	unseenMessages: number;
	lastAction?: ConvEvent;
}

function reducer(state: StateConv, action: ConvActionType): StateConv {
	switch (action.type) {
		case ConvEvent.SEND_MESSAGE: {
			return {
				...state,
				messages: [action.variables.message, ...state.messages],
				lastAction: action.type,
			};
		}
		case ConvEvent.LOAD_PREVIOUS_MESSAGES: {
			return {
				...state,
				messages: [...state.messages, ...action.variables.oldMessages],
				skip: action.variables.skip,
				lastAction: action.type,
				previousScrollHeight: action.variables.previousScrollHeight,
			};
		}
		case ConvEvent.RECEIVED_MESSAGE: {
			return {
				...state,
				messages: [action.variables.receivedMessage, ...state.messages],
				lastAction: action.type,
				unseenMessages: state.unseenMessages + 1,
			};
		}
		case ConvEvent.RESET_UNSEEN_MESSAGES: {
			return {
				...state,
				lastAction: action.type,
				unseenMessages: 0,
			};
		}
	}
	throw Error('Unknown action: ' + action.type);
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
	const outerDiv = useRef(null);
	const [message, setMessage] = useState<string>('');

	const [state, dispatch] = useReducer<Reducer<StateConv, ConvActionType>>(
		reducer,
		{ messages: startData, unseenMessages: 0, skip: 0 },
	);

	const dispatchNotification = useAppDispatchWithResetState();

	const [sendMessage, { error: createMessageDataError }] =
		useMutation(SEND_MESSAGE);

	// TODO: to replace by the right type
	function onData(options: OnDataOptions<any>) {
		dispatch({
			type: ConvEvent.RECEIVED_MESSAGE,
			variables: { receivedMessage: options.data.data.messageSent },
		});
	}

	function onError(error: ApolloError) {
		// TODO: to test
		console.log(error);
		dispatchNotification(
			popNotification({
				status: NotificationStatus.Error,
				text: error.graphQLErrors[0].message,
			}),
		);
	}

	const { error: subscriptionMessageError } = useSubscription(
		MESSAGE_SUBSCRIPTION,
		{ variables: { conversationId }, onData, onError },
	);

	const onEnter: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
		if (event.key === 'Enter' && event.shiftKey == false) {
			const trimmedMessage = message.trim();
			if (trimmedMessage) {
				sendMessage({
					variables: {
						messageInput: {
							conversationId,
							receiverId: peerId,
							text: trimmedMessage,
						},
					},
				})
					.then((createMessageData) => {
						dispatch({
							type: ConvEvent.SEND_MESSAGE,
							variables: { message: createMessageData.data.sendMessage },
						});
						setMessage('');
					})
					.catch((error) => {
						dispatchNotification(
							popNotification({
								status: NotificationStatus.Error,
								text: error.graphQLErrors[0].message,
							}),
						);
					});
			}
		}
	};

	useEffect(() => {
		if (
			(state.messages.length === count && step > count) ||
			(state.messages.length === step && step < count) ||
			state.lastAction === ConvEvent.SEND_MESSAGE
		) {
			outerDiv.current.scrollTo({
				left: 0,
				top: outerDiv.current.scrollHeight - outerDiv.current.clientHeight,
				behavior: 'smooth',
			});
		}

		if (state.lastAction === ConvEvent.LOAD_PREVIOUS_MESSAGES) {
			outerDiv.current.scrollTo({
				left: 0,
				top: outerDiv.current.scrollHeight - state.previousScrollHeight!,
			});
		}
	}, [state]);

	function loadScroll() {
		const newSkip = state.skip + step;

		const currentScrollHeight = outerDiv.current.scrollHeight;

		fetchMore({
			variables: { take: step, skip: newSkip, ...(unchangedVariables || {}) },
		}).then((data2) => {
			dispatch({
				type: ConvEvent.LOAD_PREVIOUS_MESSAGES,
				variables: {
					oldMessages: data2.data.conversation.messages,
					previousScrollHeight: currentScrollHeight,
					skip: newSkip,
				},
			});
		});
	}

	function handleScroll(event: any) {
		const { scrollTop, scrollHeight, clientHeight } = event.target;

		if (scrollTop === 0 && state.messages.length < count) {
			// if try to scroll on top, load previous messages
			loadScroll();
		}
		if (scrollTop === scrollHeight - clientHeight) {
			dispatch({ type: ConvEvent.RESET_UNSEEN_MESSAGES });
		}
	}

	return (
		<>
			<div className="bg-gray-50 w-[60rem] h-[25rem] flex flex-col-reverse">
				{state.unseenMessages !== 0 ? (
					<div className="absolute w-5/6 bg-gray-100 text-black z-10 flex justify-center">{`You have ${state.unseenMessages} unread message(s)`}</div>
				) : (
					''
				)}

				<ul
					ref={outerDiv}
					className="child h-full relative overflow-y-scroll"
					onScroll={handleScroll}
				>
					{/* @ts-ignore */}
					{state.messages
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
										className="flex flex-row-reverse mb-2 mr-2"
									>
										<li className="bg-gray-200 p-2 max-w-[30rem] rounded-xl break-words">
											{text}
										</li>
									</div>
								) : (
									<div
										key={String(id)}
										className="flex flex-start mb-2 ml-2 max-w-[30rem]"
									>
										<li className="bg-[#E4ABFF] p-2 rounded-xl max-w-[30rem] break-words">
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
					value={message}
					name="message"
					onChange={(event) => {
						setMessage(event.target.value);
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
