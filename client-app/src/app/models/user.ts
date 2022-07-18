export interface User {
	userName: string;
	displayName: string;
	token: string;
	image?: string;
}

export interface UserFormValues {
	email: string;
	password: string;
	userName?: string;
	displayName?: string;
}
