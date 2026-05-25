export class LoginUserDto {
	uesr: LoginUserInnerDto
}

class LoginUserInnerDto {
	email: string
	password: string
}
