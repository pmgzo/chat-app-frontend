'use client';

import { gql, useMutation, useSuspenseQuery } from '@apollo/client';

const GET_FRIENDS_REQUEST = gql`
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
	const { error, data } = useSuspenseQuery(GET_FRIENDS_REQUEST);
	const [removeFriend, { loading, error: removeFriendError }] =
		useMutation(REMOVE_FRIEND);

	/*@ts-ignore*/
	return data.myFriendList.length ? (
		<div className="w-30">
			Friend List:
			<ul className="grid grid-cols-1 gap-4 w-full">
				{/*@ts-ignore*/}
				{data.myFriendList?.map(({ friend: { name }, friendshipId }) => (
					// <div className="flex flex-row justify-start w-100">
					<li className="w-full">
						<div className="flex justify-start w-full">
							<div className="text-black mr-2">{name}</div>
							<button
								onClick={() =>
									removeFriend({
										variables: {
											friendshipId,
										},
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
