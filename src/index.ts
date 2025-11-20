import * as dotenv from 'dotenv';
import DBClient from './adapters/postgres.ts'


dotenv.config()

function getEnv(name: string): string {
	if (typeof process.env[name] === 'undefined') {
		throw new Error(`Variable ${name} not found`)
	}

	return process.env[name]!
}

const appConfig = {
	dbUser: getEnv("DB_USER"),
	dbHost: getEnv("DB_HOST"),
	dbPort: Number(getEnv("DB_PORT")),
	dbPassword: getEnv("DB_PASSWORD"),
	dbName: getEnv("DB_NAME"),
}

const db = new DBClient(appConfig)
const u = await db.getUserById(3)
console.log(u)
//console.log("hi")
