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

const GET_UNRESPONDED_FRIEND_REQUESTS = gql`
	query GetUnrespondedFriendRequests {
		myUnrespondedFriendRequests {
			id
			peer {
				id
				name
			}
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
	const { data: friendSuggestionsData, refetch: refetchFriendSuggestions } =
		useSuspenseQuery(GET_FRIENDS_SUGGESTIONS);
	const {
		data: unrespondedFriendRequestsData,
		refetch: refetchUnrespondedFriendRequest,
	} = useSuspenseQuery(GET_UNRESPONDED_FRIEND_REQUESTS);

	const [sendFriendRequest] = useMutation(SEND_FRIEND_REQ);

	const dispatchNotification = useAppDispatchWithResetState();

	return (
		<div className="w-60">
			<div className="text-center font-medium bg-gray-200 rounded-t-xl p-5 mb-4">
				Our friend suggestions
			</div>
			<ul className="grid grid-cols-1 gap-4 w-full overflow-y-scroll">
				{friendSuggestionsData.friendSuggestions
					?.map(({ id, name }) => (
						// <div className="flex flex-row justify-start w-100">
						<li key={id} className="w-full bg-gray-200 h-[5rem] rounded-xl">
							<div className="w-full relative">
								<button
									className="absolute right-1 text-[12px] bg-[#3DCC19] rounded mt-2 px-1"
									onClick={() =>
										sendFriendRequest({ variables: { requesteeId: id } })
											.then((sendFriendRequestData) => {
												dispatchNotification(
													popNotification({
														status: NotificationStatus.Confirmation,
														text: 'Friend request successfully sent',
													}),
												);
												refetchFriendSuggestions().then(() => {
													refetchUnrespondedFriendRequest();
												});
											})
											.catch((sendFriendRequestError) => {
												dispatchNotification(
													popNotification({
														status: NotificationStatus.Error,
														text: sendFriendRequestError.graphQLErrors[0]
															.message,
													}),
												);
											})
									}
								>
									send
								</button>
							</div>

							<div className="flex flex-col justify-center h-full w-full text-black text-center">
								{name}
							</div>
						</li>
					))
					.concat(
						unrespondedFriendRequestsData.myUnrespondedFriendRequests.map(
							({
								id: friendshipId,
								peer: { id: peerId, name },
							}: {
								id: number;
								peer: { id: number; name: string };
							}) => (
								<li
									key={`unrespondedFR-${friendshipId}-${peerId}`}
									className="w-full bg-gray-200 h-[5rem] rounded-xl"
								>
									<div className="w-full relative">
										<div className="absolute right-1 text-[12px] w-fit bg-gray-400 rounded mt-2 px-1 text-center">
											sent
										</div>
									</div>
									<div className="flex flex-col justify-center h-full">
										<div className="flex justify-center text-black text-center">
											{name}
										</div>
									</div>
								</li>
							),
						),
					)}
			</ul>
		</div>
	);
}
