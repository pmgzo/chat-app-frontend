import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './features/notification/notificationSlice';

export const makeStore = () => {
	return configureStore({
		reducer: {
			notification: notificationReducer,
		},
	});
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
