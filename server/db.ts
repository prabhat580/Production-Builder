import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import * as schema from "@shared/schema";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// DATABASE_URL format:
// mysql://USER:PASSWORD@HOST:PORT/DATABASE

const pool = mysql.createPool({
   host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin12@Q",
  database:  "production_builder",
  port: Number(process.env.DB_PORT) || 3306,
  connectionLimit: 10,
  uri: process.env.DATABASE_URL,
  // connectionLimit: 10,
});

export const db = drizzle(pool, { schema,mode:"default" });
export { pool };




// import { drizzle } from "drizzle-orm/node-postgres";
// import pg from "pg";
// import * as schema from "@shared/schema";
// import dotenv from "dotenv";

// dotenv.config();
// console.log(process.env.DATABASE_URL,'  wwwwwwwwww');
// const { Pool } = pg;

// if (!process.env.DATABASE_URL) {
//   throw new Error(
//     "DATABASE_URL must be set. Did you forget to provision a database?",
//   );
// }

// export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// export const db = drizzle(pool, { schema });

