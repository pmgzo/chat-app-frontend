import { RedirectType, redirect } from 'next/navigation';

export default function Page() {
	// redirecting by default to friends page
	return redirect('/dashboard/chats', RedirectType.push);
}
