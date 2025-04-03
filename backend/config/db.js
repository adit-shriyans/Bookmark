import pg from 'pg';
import dotenv from 'dotenv';
import pkg from 'pg-connection-string';
const { parse } = pkg;


dotenv.config();

const config = parse(process.env.NHOST_URI);

const pool = new pg.Pool(config);

const query = (text, params) => pool.query(text, params);
const connect = () => pool.connect();

export { pool, query, connect };
