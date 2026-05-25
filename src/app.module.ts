import { join } from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from './data-source';

@Module({
	imports: [
		UsersModule,
		TypeOrmModule.forRoot({
			...dataSource.options,
			migrations: [join(__dirname, 'migrations', '**', '*.js')],
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
