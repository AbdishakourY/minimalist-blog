import express from 'express';
import {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getPostsByTag,
  searchPosts
} from '../controllers/blogController.js';
import { validatePost } from '../middleware/validation.js';

const router = express.Router();

// GET /api/posts - Get all published posts
router.get('/', getAllPosts);

// GET /api/posts/search?q=query - Search posts
router.get('/search', searchPosts);

// GET /api/posts/tag/:tag - Get posts by tag
router.get('/tag/:tag', getPostsByTag);

// GET /api/posts/:slug - Get single post by slug
router.get('/:slug', getPostBySlug);

// POST /api/posts - Create new post
router.post('/', validatePost, createPost);

// PUT /api/posts/:slug - Update post
router.put('/:slug', validatePost, updatePost);

// DELETE /api/posts/:slug - Delete post
router.delete('/:slug', deletePost);

export default router;