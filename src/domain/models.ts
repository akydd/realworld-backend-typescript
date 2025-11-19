export interface RegisterUser {
	username: string
	email: string
	password: string
}

export interface User {
	email: string
	token: string
	username: string
	bio: string
	image: string
}
