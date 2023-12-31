import {
	ApolloClient,
	InMemoryCache,
	HttpLink,
	ApolloLink,
	concat,
} from '@apollo/client';

// TODO: to change for prod env
const httpLink = new HttpLink({ uri: 'http://localhost:3000/graphql' });

const authMiddleware = new ApolloLink((operation, forward) => {
	// add the authorization to the headers
	const token = sessionStorage.getItem('Token');
	operation.setContext({
		headers: {
			authorization: token ? `Bearer ${token}` : '',
		},
	});
	return forward(operation);
});

export const client = new ApolloClient({
	link: concat(authMiddleware, httpLink),
	cache: new InMemoryCache(),
});
