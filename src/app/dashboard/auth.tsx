'use client';

import { ReactNode, useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import React from 'react';

export const Auth: React.FunctionComponent<{
	children: ReactNode | JSX.Element;
}> = ({ children }) => {
	const [authorized, setAuthorized] = useState<boolean>(false);

	useEffect(() => {
		if (!sessionStorage.getItem('Token')) {
			redirect('/');
		} else {
			setAuthorized(true);
		}
	}, [authorized]);

	return authorized ? <div className="w-full h-full">{children}</div> : null;
};
