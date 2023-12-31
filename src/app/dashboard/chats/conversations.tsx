'use client';

import { gql, useSuspenseQuery } from '@apollo/client';
import { useRouter } from 'next/router';

const GET_CONVS = gql`
	query GetConvs {
		conversations {
			id
			friendshipId
			count
			messages
		}
	}
`;

export default function Conversations() {
	// const router = useRouter();

	const { error, data } = useSuspenseQuery(GET_CONVS);

	return (
		<div>
			<ul>
				{/*@ts-ignore*/}
				{data.conversations.map(({ id }) => (
					<li>
						{/* <button onClick={() => router.push(`/${id}`)}>{id}</button> */}
					</li>
				))}
			</ul>
		</div>
	);
}
