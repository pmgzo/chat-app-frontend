'use client';

import {
	NotificationStatus,
	popNotification,
} from '@/lib/features/notification/notificationSlice';
import { useAppDispatchWithResetState } from '@/lib/hooks';
import { gql, useMutation, useSuspenseQuery } from '@apollo/client';

const GET_FRIENDS_LIST = gql`
	query GetFriendlist {
		myFriendList {
			friend {
				name
			}
			friendshipId
		}
	}
`;

const REMOVE_FRIEND = gql`
	mutation RemoveFriend($friendshipId: Int!) {
		deleteFriendship(friendshipId: $friendshipId)
	}
`;

export default function FriendList() {
	const { error, data } = useSuspenseQuery(GET_FRIENDS_LIST);
	const [removeFriend, { loading, error: removeFriendError }] =
		useMutation(REMOVE_FRIEND);

	const dispatchNotification = useAppDispatchWithResetState();

	/*@ts-ignore*/
	return data.myFriendList.length ? (
		<div className="w-30">
			Friend List:
			<ul className="grid grid-cols-1 gap-4 w-full">
				{/*@ts-ignore*/}
				{data.myFriendList?.map(({ friend: { name }, friendshipId }) => (
					// <div className="flex flex-row justify-start w-100">
					<li key={name} className="w-full">
						<div className="flex justify-start w-full">
							<div className="text-black mr-2">{name}</div>
							<button
								onClick={() =>
									removeFriend({
										variables: {
											friendshipId,
										},
									})
										.then((removeFriendData) => {
											dispatchNotification(
												popNotification({
													text: 'Friend removed',
													status: NotificationStatus.Confirmation,
												}),
											);
										})
										.catch((removeFriendError) => {
											dispatchNotification(
												popNotification({
													text: "Friend wasn't removed",
													status: NotificationStatus.Error,
												}),
											);
										})
								}
							>
								Delete
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	) : (
		<div className="w-30">{"You don't have any friend :'("} </div>
	);
}
