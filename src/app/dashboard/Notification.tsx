import {
	NotificationState,
	NotificationStatus,
} from '@/lib/features/notification/notificationSlice';

export default function Notification({ status, text }: NotificationState) {
	switch (status) {
		case NotificationStatus.None:
			return '';
		case NotificationStatus.Error:
			return (
				<div className="text-white text-sm bg-[#FA2323] h-[5rem] w-[8rem] flex flex-col justify-center rounded-md shadow-md">
					<div className="flex flex-row justify-center text-center">{text}</div>
				</div>
			);
		case NotificationStatus.Confirmation:
			return (
				<div className="text-white text-sm bg-[#4AFF1D] h-[5rem] w-[8rem] flex flex-col justify-center rounded-md shadow-md">
					<div className="flex flex-row justify-center text-center">{text}</div>
				</div>
			);
	}
}
