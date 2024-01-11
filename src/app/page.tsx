'use client';

import Image from 'next/image';
import { ApolloProvider } from '@apollo/client';
import { client } from '../apollo/client';
import { BottomHomePage } from './bottom-home.page';

const Home: React.FunctionComponent<{}> = () => {
	return (
		<ApolloProvider client={client}>
			<main className="flex flex-col min-h-screen bg-gray-100">
				<div className="top-50 mx-10 p-10 rounded-3xl">
					<div className="flex justify-center">
						<div className="bg-gray-100 h-[18rem] w-[40rem] mt-10">
							<ul>
								<div
									key={'text1'}
									className="mt-3 flex flex-start mb-2 ml-2 max-w-[20rem]"
								>
									<li className="bg-[#E4ABFF] p-2 rounded-xl max-w-[20rem] break-words text-wrap">
										Have you heard about chat app ?
									</li>
								</div>

								<div
									key={'text2'}
									className="mt-3 flex flex-start mb-2 ml-2 max-w-[20rem]"
								>
									<li className="bg-[#E4ABFF] p-2 rounded-xl max-w-[20rem] break-words text-wrap">
										{
											"It's a brand you chat application where you can discuss with your friends !!!\
											And we would soon be able to audio call and create chat rooms !"
										}
									</li>
								</div>
								<div
									key={'text3'}
									className="mt-3 flex flex-row-reverse mb-2 mr-2"
								>
									<li className="bg-gray-200 p-2 rounded-xl max-w-[20rem] break-words text-wrap">
										Dude what do we waiting for ?
									</li>
								</div>
							</ul>
						</div>
					</div>
					<div className="flex justify-center text-bold text-[40px]">
						chat app
					</div>
				</div>
				{/* <Image
							src="/chat.svg"
							width={210}
							height={210}
							className="dark:invert absolute left-80"
							alt="Jivan from Noun Project"
					/> */}
				{/* TODO: refacto */}
				<BottomHomePage />
			</main>
		</ApolloProvider>
	);
};

export default Home;
