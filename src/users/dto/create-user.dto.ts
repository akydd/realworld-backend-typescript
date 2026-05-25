export class CreateUserDto {
	user: CreateUserDtoInner
}

class CreateUserDtoInner {
	readonly username: string
	readonly email: string
	readonly password: string
}
