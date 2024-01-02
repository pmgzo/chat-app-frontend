'use client';

import { gql, useSuspenseQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';

const GET_CONVS = gql`
	query GetConvs($take: Int!) {
		conversations {
			id
			friendshipId
			count
			messages(take: $take) {
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

export default function Conversations() {
	const router = useRouter();

	const { error, data } = useSuspenseQuery(GET_CONVS, {
		variables: { take: 2 },
	});

	return (
		<div className="w-50">
			{"Conversations:"}
			{/**@ts-ignore */}
			{data.conversations?.length ? (
				<ul className="flex justify-start">
					{/*@ts-ignore*/}
					{data.conversations.map(({ id, messages, peer: { name } }) => (
						<li className="p-2">
							{/* Display messages here */}
							<button onClick={() => router.push(`dashboard/chats/${id}`)}>
								conversation with {name}
							</button>
						</li>
					))}
				</ul>
			) : (
				'No conversations'
			)}
		</div>
	);
}
