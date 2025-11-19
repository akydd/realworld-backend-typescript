import * as dotenv from 'dotenv'
import DBClient from './adapters/postgres'


dotenv.config()
db = new DBClient{ }
