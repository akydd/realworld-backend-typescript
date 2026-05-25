import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) { }

	create(createUserDto: CreateUserDto): User {
		return this.usersRepository.create({
			username: createUserDto.user.username,
			email: createUserDto.user.email,
			password: createUserDto.user.password,
		})
	}

	findAll(): Promise<User[]> {
		return this.usersRepository.find()
	}

	findOne(id: number): Promise<User | null> {
		return this.usersRepository.findOneBy({ id })
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`;
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}

	login(loginUserDto: LoginUserDto) {
		return "This action logs un a user";
	}
}
