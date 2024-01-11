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
	const { error, data, refetch } = useSuspenseQuery(GET_FRIENDS_LIST);
	const [removeFriend, { loading, error: removeFriendError }] =
		useMutation(REMOVE_FRIEND);

	const dispatchNotification = useAppDispatchWithResetState();

	/*@ts-ignore*/
	return data.myFriendList.length ? (
		<div className="w-60">
			<div className="text-center font-medium bg-gray-200 rounded-t-xl p-5 mb-4">
				Your friends
			</div>
			<ul className="grid grid-cols-1 gap-4 w-full overflow-y-scroll">
				{/*@ts-ignore*/}
				{data.myFriendList?.map(({ friend: { name }, friendshipId }) => (
					// <div className="flex flex-row justify-start w-100">
					<li key={name} className="w-full bg-gray-200 h-[5rem] rounded-xl">
						<div className="w-full relative">
							<button
								className="absolute right-1 text-[12px] bg-[#FE4F4F] rounded mt-2 px-1"
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
											refetch();
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
								remove
							</button>
						</div>
						<div className="flex flex-col justify-center h-full  w-full text-black mr-2 text-center">
							{name}
						</div>
					</li>
				))}
			</ul>
		</div>
	) : (
		<div className="w-30">{"You don't have any friend :'("} </div>
	);
}
