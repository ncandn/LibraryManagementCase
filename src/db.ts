import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export default new Pool({
    user: 'postgres',
    host: 'localhost',
    password: `${process.env.DB_PASS}`,
    database: process.env.DB_ID,
    port: 5432
});
