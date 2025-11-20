import { Pool } from 'pg'
import { type RegisterUser, type User, type Config } from '../domain/models.ts'

export default class DBClient {
	pool: Pool

	constructor(config: Config) {
		this.pool = new Pool({
			host: config.dbHost,
			port: config.dbPort,
			user: config.dbUser,
			database: config.dbName,
			password: config.dbPassword,
		})
	}

	async registerUser(u: RegisterUser): Promise<User> {
		const client = await this.pool.connect()
		const res = client.query("insert into users (username, email, password) values ($1, $2, $3) returning *", [u.username, u.email, u.password])

		return {
			username: "hi",
			token: "token",
			email: "test@test.com"
		}

	}

	async getUserById(id: number): Promise<User | null> {
		const client = await this.pool.connect()
		const res = client.query("select * from users where id = $1", [id])

		return {
			username: "hi",
			token: "token",
			email: "test@test.com"
		}
	}
}
