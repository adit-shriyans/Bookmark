import bcrypt from 'bcrypt';
import * as db from '../config/db.js';

// Get user by email
async function getUserByEmail(email) {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

// Get user by id
async function getUserById(id) {
  const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

// Create new user
async function createUser(name, email, password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const result = await db.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
    [name, email, hashedPassword]
  );
  
  return result.rows[0];
}


// Get all users
async function getAllUsers() {
  const result = await db.query('SELECT id, name, email, created_at FROM users ORDER BY name');
  return result.rows;
}


export {
  getUserByEmail,
  getUserById,
  createUser,
  getAllUsers,
}; 