'use client';

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

	/*@ts-ignore*/
	return data.myFriendRequests.length ? (
		<div className="w-30">
			Requests:
			<ul className="grid grid-cols-1 gap-4 w-full">
				{/*@ts-ignore*/}
				{data.myFriendRequests?.map(({ id, requester: { name } }) => (
					// <div className="flex flex-row justify-start w-100">
					<li className="w-full">
						<div className="flex justify-start w-full">
							<div className="text-black mr-2">{name}</div>
							<button
								className="mr-2"
								onClick={() =>
									respondFriendRequest({
										variables: {
											response: { friendRequestId: id, accept: true },
										},
									})
								}
							>
								Accept
							</button>
							<button
								onClick={() =>
									respondFriendRequest({
										variables: { friendRequestId: id, accept: false },
									})
								}
							>
								Refuse
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	) : (
		<div className="w-30">{'No Friend Request :('} </div>
	);
}
