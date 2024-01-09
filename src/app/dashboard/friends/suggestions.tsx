'use client';

import {
	NotificationStatus,
	popNotification,
} from '@/lib/features/notification/notificationSlice';
import { useAppDispatchWithResetState } from '@/lib/hooks';
import { gql, useMutation, useSuspenseQuery } from '@apollo/client';

const GET_FRIENDS_SUGGESTIONS = gql`
	query GetFriendSuggestions {
		friendSuggestions {
			id
			name
		}
	}
`;

const SEND_FRIEND_REQ = gql`
	mutation SendFriendReq($requesteeId: Int!) {
		sendFriendRequest(requesteeId: $requesteeId) {
			id
			requesterId
			pending
			peer {
				id
			}
		}
	}
`;

export default function FriendSuggestions() {
	const { error, data } = useSuspenseQuery(GET_FRIENDS_SUGGESTIONS);
	const [
		sendFriendRequest,
		{ data: friendReqData, loading, error: friendSuggestionError },
	] = useMutation(SEND_FRIEND_REQ);

	const dispatchNotification = useAppDispatchWithResetState();

	// TODO: consider people with non responded friend request

	return (
		<div className="w-30">
			Suggestions:
			<ul className="grid grid-cols-1 gap-4 w-full">
				{/*@ts-ignore*/}
				{data.friendSuggestions?.map(({ id, name }) => (
					// <div className="flex flex-row justify-start w-100">
					<li key={id} className="w-full">
						<div className="flex justify-start w-full">
							<div className="text-black mr-2">{name}</div>
							<button
								onClick={() =>
									sendFriendRequest({ variables: { requesteeId: id } })
										.then((sendFriendRequestData) => {
											dispatchNotification(
												popNotification({
													status: NotificationStatus.Confirmation,
													text: 'Friend request successfully sent',
												}),
											);
										})
										.catch((sendFriendRequestError) => {
											dispatchNotification(
												popNotification({
													status: NotificationStatus.Error,
													text: sendFriendRequestError.graphQLErrors[0].message,
												}),
											);
										})
								}
							>
								Send
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
