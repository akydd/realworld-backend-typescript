export interface RegisterUser {
	username: string
	email: string
	password: string
}

export interface User {
	email: string
	token: string
	username: string
	bio?: string
	image?: string
}

export interface Config {
	dbUser: string
	dbHost: string
	dbPort: number
	dbPassword: string
	dbName: string
}
