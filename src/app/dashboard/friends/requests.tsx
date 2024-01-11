'use client';

import {
	NotificationStatus,
	popNotification,
} from '@/lib/features/notification/notificationSlice';
import { useAppDispatchWithResetState } from '@/lib/hooks';
import { gql, useMutation, useSuspenseQuery } from '@apollo/client';

const GET_FRIENDS_REQUEST = gql`
	query GetFriendRequests {
		myFriendRequests {
			id
			requester {
				name
			}
		}
	}
`;

const RESPOND_FRIENDS_REQUEST = gql`
	mutation RespondFriendRequest($response: FriendRequestResponseInput!) {
		respondToFriendRequest(response: $response)
	}
`;

export default function FriendRequests() {
	const { error, data } = useSuspenseQuery(GET_FRIENDS_REQUEST);
	const [respondFriendRequest, { loading, error: respondFriendReqError }] =
		useMutation(RESPOND_FRIENDS_REQUEST);

	const dispatchNotification = useAppDispatchWithResetState();

	/*@ts-ignore*/
	return data.myFriendRequests.length ? (
		<div className="w-60">
			<div className="text-center font-medium bg-gray-200 rounded-t-xl p-5 mb-4">
				Requests
			</div>
			<ul className="grid grid-cols-1 gap-4 w-full overflow-y-scroll">
				{/*@ts-ignore*/}
				{data.myFriendRequests?.map(({ id, requester: { name } }) => (
					// <div className="flex flex-row justify-start w-100">
					<li key={id} className="w-full bg-gray-200 h-[5rem] rounded-xl flex flex-col justify-center">
						<div className="w-full text-black text-center">{name}</div>
						<div className="flex justify-center ">
							<div className="b-1 w-1/2 flex justify-evenly">
								<button
									className="bg-[#3DCC19] w-fit text-[12px] rounded px-1"
									onClick={() =>
										respondFriendRequest({
											variables: {
												response: { friendRequestId: id, accept: true },
											},
										})
											.then((respondFriendReqData) => {
												dispatchNotification(
													popNotification({
														status: NotificationStatus.Confirmation,
														text: 'Action successfull',
													}),
												);
											})
											.catch((respondFriendReqError) => {
												dispatchNotification(
													popNotification({
														status: NotificationStatus.Error,
														text: respondFriendReqError.graphQLErrors[0]
															.message,
													}),
												);
											})
									}
								>
									Accept
								</button>
								<button
									className="w-fit text-[12px] bg-[#FE4F4F] rounded px-1"
									onClick={() =>
										respondFriendRequest({
											variables: { friendRequestId: id, accept: false },
										})
											.then((respondFriendReqData) => {
												dispatchNotification(
													popNotification({
														status: NotificationStatus.Confirmation,
														text: 'Action successfull',
													}),
												);
											})
											.catch((respondFriendReqError) => {
												dispatchNotification(
													popNotification({
														status: NotificationStatus.Error,
														text: respondFriendReqError.graphQLErrors[0]
															.message,
													}),
												);
											})
									}
								>
									Refuse
								</button>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	) : (
		<div className="w-60">
			<div className="text-center font-medium bg-gray-200 rounded-t-xl p-5">
				{"No friend request :("}
			</div>
		</div>
	);
}
