'use client';

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

	// TODO: consider people with non responded friend request
	console.log(data);

	return (
		<div className="w-30">
			Suggestions:
			<ul className="grid grid-cols-1 gap-4 w-full">
				{/*@ts-ignore*/}
				{data.friendSuggestions?.map(({ id, name }) => (
					// <div className="flex flex-row justify-start w-100">
					<li className="w-full">
						<div className="flex justify-start w-full">
							<div className="text-black mr-2">{name}</div>
							<button
								onClick={() =>
									sendFriendRequest({ variables: { requesteeId: id } })
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
