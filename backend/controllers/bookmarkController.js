import * as bookmarkModel from '../models/bookmarkModel.js';

// Get all bookmarks
export const getAllBookmarks = async (req, res) => {
  try {
    const bookmarks = await bookmarkModel.getAllBookmarks();
    res.json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ message: 'Server error while fetching bookmarks' });
  }
};

// Get a specific bookmark
export const getBookmarkById = async (req, res) => {
  try {
    const { id } = req.params;
    const bookmark = await bookmarkModel.getBookmarkById(id);
    
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    
    res.json(bookmark);
  } catch (error) {
    console.error('Error fetching bookmark details:', error);
    res.status(500).json({ message: 'Server error while fetching bookmark details' });
  }
};

// Get bookmarks by user ID
export const getBookmarksByUserId = async (req, res) => {
  try {
    const { user_id } = req.req.id;
    const bookmarks = await bookmarkModel.getBookmarksByUserId(user_id);
    res.json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks for user:', error);
    res.status(500).json({ message: 'Server error while fetching user bookmarks' });
  }
};

export const getBookmarkByUserIDandCategory = async (req, res) => {
  try {
    const user_id = req.user.id;
    const {category} = req.params;
    const bookmarks = await bookmarkModel.getBookmarkByUserIDandCategory(user_id, category);
    res.json(bookmarks);
  } catch(error) {
    console.error('Error fetching bookmarks for user with category:', error);
    res.status(500).json({ message: 'Server error while fetching user bookmarks with category' });
  }
}

// Add a new bookmark
export const addBookmark = async (req, res) => {
  try {
    const { user_id, title, link, category_ids = [] } = req.body;
    
    // Validate input
    if (!title || !user_id || !link) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if bookmark already exists
    const existingBookmark = await bookmarkModel.getBookmarkByTitle(title);
    if (existingBookmark) {
      return res.status(400).json({ message: 'Bookmark with this Title already exists' });
    }
    
    // Create new Bookmark
    const newBookmark = await bookmarkModel.createBookmark(user_id, title, link, category_ids);
    res.status(201).json(newBookmark);
  } catch (error) {
    console.error('Error adding Bookmark:', error);
    res.status(500).json({ message: 'Server error while adding Bookmark' });
  }
};

// Update an existing bookmark
export const updateBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, title, link } = req.body;
    // Validate input
    if (!user_id || !title || !link) {
      return res.status(400).json({ message: 'user_id, title, and link are required' });
    }
    // Check if the bookmark exists
    const existingBookmark = await bookmarkModel.getBookmarkById(id);
    if (!existingBookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    // Update bookmark using the model function
    const updatedBookmark = await bookmarkModel.updateBookmark(id, { user_id, title, link });
    res.json(updatedBookmark);
  } catch (error) {
    console.error('Error updating bookmark:', error);
    res.status(500).json({ message: 'Server error while updating bookmark' });
  }
};

// Delete a bookmark
export const deleteBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if bookmark exists
    const existingBookmark = await bookmarkModel.getBookmarkById(id);
    if (!existingBookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    // Delete the bookmark
    await bookmarkModel.deleteBookmark(id);
    res.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    res.status(500).json({ message: 'Server error while deleting bookmark' });
  }
};

// Search bookmarks by criteria (title, link, or user_id)
export const searchBookmarks = async (req, res) => {
  try {
    const { title, link, user_id } = req.query;
    const bookmarks = await bookmarkModel.searchBookmarks({ title, link, user_id });
    res.json(bookmarks);
  } catch (error) {
    console.error('Error searching bookmarks:', error);
    res.status(500).json({ message: 'Server error while searching bookmarks' });
  }
};

// Add a category to a bookmark
export const addCategoryToBookmark = async (req, res) => {
  try {
    const { bookmark_id, category_id } = req.body;
    if (!bookmark_id || !category_id) {
      return res.status(400).json({ message: 'bookmark_id and category_id are required' });
    }
    await bookmarkModel.addCategoryToBookmark(bookmark_id, category_id);
    res.json({ message: 'Category added to bookmark successfully' });
  } catch (error) {
    console.error('Error adding category to bookmark:', error);
    res.status(500).json({ message: 'Server error while adding category to bookmark' });
  }
};

// Remove a category from a bookmark
export const removeCategoryFromBookmark = async (req, res) => {
  try {
    const { bookmark_id, category_id } = req.body;
    if (!bookmark_id || !category_id) {
      return res.status(400).json({ message: 'bookmark_id and category_id are required' });
    }
    await bookmarkModel.removeCategoryFromBookmark(bookmark_id, category_id);
    res.json({ message: 'Category removed from bookmark successfully' });
  } catch (error) {
    console.error('Error removing category from bookmark:', error);
    res.status(500).json({ message: 'Server error while removing category from bookmark' });
  }
};

export const addBookmarksBatch = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { bookmarks } = req.body; // Expect an array of bookmark objects: [{ title, link, category_ids }, ...]
    
    if (!Array.isArray(bookmarks) || bookmarks.length === 0) {
      return res.status(400).json({ message: 'A non-empty bookmarks array is required' });
    }
    
    const createdBookmarks = [];
    for (const bm of bookmarks) {
      const { title, link, category_ids = [] } = bm;
      if (!title || !link) {
        continue; // Skip invalid entries
      }
      // Optionally check for duplicates per user
      const existing = await bookmarkModel.getBookmarkByTitleAndUserId(title, user_id);
      if (existing) continue;
      
      const newBm = await bookmarkModel.createBookmark({ user_id, title, link, category_ids });
      createdBookmarks.push(newBm);
    }
    res.status(201).json({ message: 'Bookmarks created', bookmarks: createdBookmarks });
  } catch (error) {
    console.error('Error adding bookmarks in batch:', error);
    res.status(500).json({ message: 'Server error while adding bookmarks in batch' });
  }
};