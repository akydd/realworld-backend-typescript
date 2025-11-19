import { Pool, PoolConfig } from 'pg'
import { RegisterUser, User } from '../domain/models'

export default class DBClient {
	pool: Pool
	config: PoolConfig

	constructor(config: any) {
		this.config = {}
		this.pool = new Pool(this.config)
	}

	async registerUser(u: RegisterUser): User {
		const client = await this.pool.connect()
		const res = client.query("insert into users (username, email, password) values ($1, $2, $3) returning *", [u.username, u.email, u.password])


	}

	async getUserById(id: number): User {
		const client = await this.pool.connect()
		const res = client.query("select * from users where id = $1", [id])
	}
}
