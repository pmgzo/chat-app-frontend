'use client';

import { gql, useSuspenseQuery } from '@apollo/client';
import Link from 'next/link';

const GET_CONVS = gql`
	query GetConvs($take: Int!) {
		conversations {
			id
			friendshipId
			count
			messages(take: $take) {
				id
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
	const { error, data } = useSuspenseQuery(GET_CONVS, {
		variables: { take: 4 },
	});

	function cutString(text: string) {
		return text.length > 10 ? `${text.substring(0, 10)}...` : text;
	}

	return (
		<div className="w-50 ml-3">
			{'Conversations feed:'}
			{data.conversations?.length ? (
				<ul className="flex justify-start overflow-x-scroll">
					{data.conversations.map(
						({ id: conversationId, messages, peer: { id: peerId, name } }) => (
							<li key={peerId} className="h-[17rem] w-[15rem] mr-3">
								<Link
									className="w-full h-full flex flex-col rounded-xl hover:shadow-md"
									href={{
										pathname: `chats/${name}`,
										query: { conversationId, peerId },
									}}
								>
									<div className="flex flex-col justify-center text-center h-1/6 bg-gray-200 rounded-t-xl">
										{name}
									</div>
									<div className="bg-gray-50 w-full h-4/6">
										<ul>
											{messages
												.map(({ text, senderId, id }) =>
													senderId === peerId ? (
														<div
															key={String(id)}
															className="flex flex-row-reverse max-w-3/6max-w-[7rem] mt-1 mr-1"
														>
															<li className="bg-gray-200 p-2 rounded-xl max-w-[7rem] text-sm">
																{cutString(text)}
															</li>
														</div>
													) : (
														<div
															key={String(id)}
															className="flex flex-start max-w-[7rem] mt-1 ml-1"
														>
															<li className="bg-[#E4ABFF] text-black p-2 rounded-xl max-w-[7rem] text-sm">
																{cutString(text)}
															</li>
														</div>
													),
												)
												.reverse()}
										</ul>
									</div>
									<div className="bg-[#E4ABFF] h-1/4 rounded-b-xl"></div>
								</Link>
							</li>
						),
					)}
				</ul>
			) : (
				'No conversations'
			)}
		</div>
	);
}
