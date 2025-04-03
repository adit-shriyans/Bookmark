import * as db from '../config/db.js';

// Get all bookmarks with their categories aggregated as an array
async function getAllBookmarks() {
  const query = `
    SELECT b.*, 
      COALESCE(array_agg(c.name) FILTER (WHERE c.name IS NOT NULL), '{}') AS categories
    FROM Bookmark b
    LEFT JOIN BookmarkCategory bc ON b.id = bc.bookmark_id
    LEFT JOIN Category c ON bc.category_id = c.id
    GROUP BY b.id
    ORDER BY b.created_at DESC
  `;
  const result = await db.query(query);
  return result.rows;
}

// Get a single bookmark by its id with its categories
async function getBookmarkById(id) {
  const query = `
    SELECT b.*, 
      COALESCE(array_agg(c.name) FILTER (WHERE c.name IS NOT NULL), '{}') AS categories
    FROM Bookmark b
    LEFT JOIN BookmarkCategory bc ON b.id = bc.bookmark_id
    LEFT JOIN Category c ON bc.category_id = c.id
    WHERE b.id = $1
    GROUP BY b.id
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
}

async function getBookmarkByTitle(title) {
  const query = `
    SELECT b.*, 
      COALESCE(array_agg(c.name) FILTER (WHERE c.name IS NOT NULL), '{}') AS categories
    FROM Bookmark b
    LEFT JOIN BookmarkCategory bc ON b.id = bc.bookmark_id
    LEFT JOIN Category c ON bc.category_id = c.id
    WHERE b.title = $1
    GROUP BY b.id
  `;
  const result = await db.query(query, [title]);
  return result.rows[0];
}

async function getBookmarksByUserId(user_id) {
  const query = `
    SELECT b.*, COALESCE(array_agg(c.name) FILTER (WHERE c.name IS NOT NULL), '{}') AS categories
    FROM Bookmark b
    LEFT JOIN BookmarkCategory bc ON b.id = bc.bookmark_id
    LEFT JOIN Category c ON bc.category_id = c.id
    WHERE b.user_id = $1
    ORDER BY b.created_at DESC
  `
  const result = await db.query(query, [user_id]);
  return result.rows;
}

// Create a new bookmark and optionally assign an array of category IDs
async function createBookmark({ user_id, title, link, category_ids = [] }) {
  // Insert the new bookmark
  const insertQuery = `
    INSERT INTO Bookmark (user_id, title, link)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const bookmarkResult = await db.query(insertQuery, [user_id, title, link]);
  const bookmark = bookmarkResult.rows[0];

  // If any category IDs are provided, link them using the join table
  for (const category_id of category_ids) {
    await db.query(
      "INSERT INTO BookmarkCategory (bookmark_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [bookmark.id, category_id]
    );
  }
  return bookmark;
}

// Update an existing bookmark's details (does not update categories)
async function updateBookmark(id, { user_id, title, link }) {
  const query = `
    UPDATE Bookmark SET 
      user_id = COALESCE($1, user_id),
      title = COALESCE($2, title),
      link = COALESCE($3, link)
    WHERE id = $4
    RETURNING *
  `;
  const result = await db.query(query, [user_id, title, link, id]);
  return result.rows[0];
}

// Delete a bookmark (will cascade delete from BookmarkCategory if configured)
async function deleteBookmark(id) {
  await db.query("DELETE FROM Bookmark WHERE id = $1", [id]);
}

// Add a category to a bookmark (inserts into the join table)
async function addCategoryToBookmark(bookmark_id, category_id) {
  await db.query(
    "INSERT INTO BookmarkCategory (bookmark_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
    [bookmark_id, category_id]
  );
}

// Remove a category from a bookmark (deletes from the join table)
async function removeCategoryFromBookmark(bookmark_id, category_id) {
  await db.query(
    "DELETE FROM BookmarkCategory WHERE bookmark_id = $1 AND category_id = $2",
    [bookmark_id, category_id]
  );
}

// Search bookmarks by criteria (title, link, or user_id)
async function searchBookmarks({ title, link, user_id }) {
  let query = `
    SELECT b.*, 
      COALESCE(array_agg(c.name) FILTER (WHERE c.name IS NOT NULL), '{}') AS categories
    FROM Bookmark b
    LEFT JOIN BookmarkCategory bc ON b.id = bc.bookmark_id
    LEFT JOIN Category c ON bc.category_id = c.id
    WHERE 1=1
  `;
  const params = [];
  
  if (title) {
    params.push(`%${title}%`);
    query += ` AND b.title ILIKE $${params.length}`;
  }
  
  if (link) {
    params.push(`%${link}%`);
    query += ` AND b.link ILIKE $${params.length}`;
  }
  
  if (user_id) {
    params.push(user_id);
    query += ` AND b.user_id = $${params.length}`;
  }
  
  query += `
    GROUP BY b.id
    ORDER BY b.created_at DESC
  `;
  
  const result = await db.query(query, params);
  return result.rows;
}

async function getBookmarkByUserIDandCategory({user_id, category}) {
  const query = `
    SELECT b.*, 
      COALESCE(array_agg(c.name) FILTER (WHERE c.name IS NOT NULL), '{}') AS categories
    FROM Bookmark b
    LEFT JOIN BookmarkCategory bc ON b.id = bc.bookmark_id
    LEFT JOIN Category c ON bc.category_id = c.id
    WHERE b.user_id = $1
      AND c.name = $2
    GROUP BY b.id
  `;
  const result = await db.query(query, [user_id, category]);
  return result.rows;
}

// Get a bookmark by title and user_id
async function getBookmarkByTitleAndUserId(title, user_id) {
  const query = `
    SELECT b.*, 
      COALESCE(array_agg(c.name) FILTER (WHERE c.name IS NOT NULL), '{}') AS categories
    FROM Bookmark b
    LEFT JOIN BookmarkCategory bc ON b.id = bc.bookmark_id
    LEFT JOIN Category c ON bc.category_id = c.id
    WHERE b.title = $1 AND b.user_id = $2
    GROUP BY b.id
  `;
  const result = await db.query(query, [title, user_id]);
  return result.rows[0];
}

export {
  getAllBookmarks,
  getBookmarkById,
  getBookmarksByUserId,
  getBookmarkByUserIDandCategory,
  getBookmarkByTitle,
  getBookmarkByTitleAndUserId,
  createBookmark,
  updateBookmark,
  deleteBookmark,
  addCategoryToBookmark,
  removeCategoryFromBookmark,
  searchBookmarks
};
