import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
	// to change for prod env
	uri: 'http://localhost:3000/graphql',
	cache: new InMemoryCache(),
});
