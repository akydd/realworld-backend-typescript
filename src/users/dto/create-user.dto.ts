import { IsDefined, IsEmail, IsNotEmpty, IsString, IsStrongPassword, ValidateNested } from "class-validator"
import { Type } from "class-transformer"

class CreateUserDtoInner {
	@IsString()
	@IsNotEmpty()
	readonly username: string

	@IsEmail()
	readonly email: string

	@IsStrongPassword()
	readonly password: string
}

export class CreateUserDto {
	@IsDefined()
	@ValidateNested()
	@Type(() => CreateUserDtoInner)
	user: CreateUserDtoInner
}
