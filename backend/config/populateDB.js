import { createUser } from "../models/userModel.js";
import * as db from "./db.js";

const populateUsers = async () => {
    const defaultUsersExist = await db.query("SELECT COUNT(*) FROM users");
    if (parseInt(defaultUsersExist.rows[0].count) === 0) {
    const defaultUsers = [
            ['Student', 'student@example.com', 'password'],
            ['Admin', 'admin@example.com', 'password'],
        ];
        for (const [name, email, password] of defaultUsers) {
            createUser( name, email, password);
        }
    }
}
// Populate default categories
const populateCategories = async () => {
    const result = await db.query("SELECT COUNT(*) FROM Category");
    if (parseInt(result.rows[0].count) === 0) {
      const defaultCategories = [
        ['Food'],
        ['Travel'],
        ['Tech'],
        ['Entertainment'],
        ['Lifestyle']
      ];
      for (const [name] of defaultCategories) {
        await db.query(
          "INSERT INTO Category (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
          [name]
        );
      }
    }
  };
  
  // Populate default bookmarks
  const populateBookmarks = async () => {
    const result = await db.query("SELECT COUNT(*) FROM Bookmarks");
    if (parseInt(result.rows[0].count) === 0) {
      // For example, user_id 1 and 2 already exist from populateUsers
      const defaultBookmarks = [
        [1, 'Delicious Recipes', 'https://example.com/food-blog'],
        [1, 'World Travel Guide', 'https://example.com/travel-blog'],
        [2, 'Latest Tech Trends', 'https://example.com/tech-news']
      ];
      for (const [user_id, title, link] of defaultBookmarks) {
        await db.query(
          "INSERT INTO Bookmarks (user_id, title, link) VALUES ($1, $2, $3)",
          [user_id, title, link]
        );
      }
    }
  };
  
  const populateBookmarkCategories = async () => {
    const result = await db.query("SELECT COUNT(*) FROM BookmarkCategory");
    if (parseInt(result.rows[0].count) === 0) {
      const defaultBookmarkCategories = [
        [2, 1],
        [2, 2],
        [3, 2],
        [4, 3],
      ];
      for (const [bookmark_id, category_id] of defaultBookmarkCategories) {
        await db.query(
          "INSERT INTO BookmarkCategory (bookmark_id, category_id) VALUES ($1, $2)",
          [bookmark_id, category_id]
        );
      }
    }
  };
  
  export const populateDB = async () => {
    await populateUsers();
    await populateCategories();
    await populateBookmarks();
    await populateBookmarkCategories();
    console.log("Default bookmarks and categories populated.");
  };
  