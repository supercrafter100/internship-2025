import { Pool } from "pg";
import { config } from "./config";

const pool = new Pool({
  connectionString: config.database.connectionString,
});

export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows;
  } catch (err) {
    console.error("❌ Database query error:", err);
    throw err;
  } finally {
    client.release();
  }
};
