import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export enum NotificationStatus {
	None = 1,
	Error,
	Confirmation,
}

export interface NotificationState {
	text: string;
	status: NotificationStatus;
	// message sent,
	// friendrequest sent
	// friend has accepted your friend request
}

const initialState: NotificationState = {
	text: '',
	status: NotificationStatus.None,
};

export const notificationSlice = createSlice({
	name: 'notification',
	initialState,
	reducers: {
		popNotification: (
			state,
			action: PayloadAction<{ text: string; status: NotificationStatus }>,
		) => {
			state.status = action.payload.status;
			state.text = action.payload.text;
		},
		removeNotification: (state) => {
			state.status = NotificationStatus.None;
		},
	},
});

export const { popNotification, removeNotification } =
	notificationSlice.actions;

export default notificationSlice.reducer;
