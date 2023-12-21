'use client';

import Image from 'next/image';
import { ApolloProvider } from '@apollo/client';
import { client } from '../apollo/client';
import { BottomHomePage } from './bottom-home.page';

const Home: React.FunctionComponent<{}> = () => {
	return (
		<ApolloProvider client={client}>
			<main className="flex flex-col min-h-screen bg-gray-100">
				<div className="bg-black w-max-full top-50 mx-10 my-5 p-10 rounded-3xl">
					<div className="flex flex-row justify-center">
						<Image
							src="/chat.svg"
							width={210}
							height={210}
							className="dark:invert"
							alt="Jivan from Noun Project"
						/>
						<div className="text-9xl text-white">Chat app</div>
					</div>
				</div>

				{/* TODO: refacto */}
				<BottomHomePage />
			</main>
		</ApolloProvider>
	);
};

export default Home;
