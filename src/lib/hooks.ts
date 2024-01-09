import { useDispatch, useSelector, useStore } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch, AppStore } from './store';
import {
	NotificationStatus,
	removeNotification,
} from './features/notification/notificationSlice';
import { PayloadAction } from '@reduxjs/toolkit';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;

export const useAppDispatchWithResetState = () => {
	const dispatch = useAppDispatch();

	function dispatchAndReset(
		action: PayloadAction<{ text: string; status: NotificationStatus }>,
	) {
		dispatch(action);
		// remove notification after 5s
		setTimeout(() => {
			dispatch(removeNotification());
		}, 5000);
	}
	return dispatchAndReset;
};
