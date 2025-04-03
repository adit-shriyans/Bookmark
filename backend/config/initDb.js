import * as db from './db.js';
import { populateDB } from './populateDB.js';

async function initializeDatabase() {
  try {
    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Bookmarks table
    await db.query(`
      CREATE TABLE IF NOT EXISTS Bookmarks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title VARCHAR(50) NOT NULL UNIQUE,
        link TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create the Category table
    await db.query(`
      CREATE TABLE IF NOT EXISTS Category (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
      );
    `);

    // Create the join table linking bookmarks and categories
    await db.query(`
      CREATE TABLE IF NOT EXISTS BookmarkCategory (
        bookmark_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        PRIMARY KEY (bookmark_id, category_id),
        CONSTRAINT fk_bookmark
          FOREIGN KEY (bookmark_id)
          REFERENCES Bookmarks(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_category
          FOREIGN KEY (category_id)
          REFERENCES Category(id)
          ON DELETE CASCADE
      );
    `);

    populateDB();
  } catch (error) {
    console.error('Error initializing database tables:', error);
  }
}

export default initializeDatabase; 