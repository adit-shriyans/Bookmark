import express from 'express';
import * as bookmarkController from '../controllers/bookmarkController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

//1. post /bookmarks : let someone add new bookmark they want to save
router.post('/', authenticateToken, bookmarkController.addBookmark);

//2. get /bookmarks/all : get all bookmarks someone has saved
router.get('/all', authenticateToken, bookmarkController.getBookmarksByUserId)

// 3. get /bookmarks/category : let someone see all the bookmakrs in a specific category
router.get('/category/:category', authenticateToken, bookmarkController.getBookmarkByUserIDandCategory);

// 4. post /bookmarks/batch : let someone add several bookmarks at once, user sends a list of bookmarks
router.post('/batch', authenticateToken, bookmarkController.addBookmarksBatch);

export { router as default }; 