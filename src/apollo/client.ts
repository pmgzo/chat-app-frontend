'use client';

import {
	ApolloClient,
	InMemoryCache,
	HttpLink,
	ApolloLink,
	concat,
	split
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

// TODO: to change for prod env
const httpLink = new HttpLink({ uri: 'http://localhost:3000/graphql' });

const wsLink = new GraphQLWsLink(createClient({
	url: 'ws://localhost:3000/subscriptions',
	connectionParams: () => ({
		token: `Bearer ${sessionStorage?.getItem('Token')}`,
	}),
}));

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

const splitLink = split(
	({ query }) => {
	  const definition = getMainDefinition(query);
	  return (
		definition.kind === 'OperationDefinition' &&
		definition.operation === 'subscription'
	  );
	},
	wsLink,
	concat(authMiddleware, httpLink),
  );

export const client = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache(),
});
