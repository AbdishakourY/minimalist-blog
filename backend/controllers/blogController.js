import Post from '../models/Post.js';
import { createSlug } from '../utils/helpers.js';

// @desc    Get all posts (including unpublished for admin)
// @route   GET /api/posts
// @access  Public/Admin
export const getAllPosts = async (req, res) => {
  try {
    console.log('getAllPosts called with query:', req.query);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const includeUnpublished = req.query.includeUnpublished === 'true';

    console.log('includeUnpublished:', includeUnpublished);

    // For admin dashboard, include unpublished posts
    const filter = includeUnpublished ? {} : { published: true };
    
    const posts = await Post.find(filter)
      .select('title slug excerpt author tags publishedAt createdAt readingTime published')
      .sort({ createdAt: -1 }) // Sort by creation date for admin
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    console.log(`Found ${posts.length} posts (total: ${total})`);

    res.json({
      success: true,
      data: posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error in getAllPosts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
};

// @desc    Get single post by slug (including unpublished for admin)
// @route   GET /api/posts/:slug
// @access  Public
export const getPostBySlug = async (req, res) => {
  try {
    console.log('getPostBySlug called for slug:', req.params.slug);
    
    // For admin, allow access to unpublished posts
    const isAdminRequest = req.query.admin === 'true';
    const filter = isAdminRequest 
      ? { slug: req.params.slug }
      : { slug: req.params.slug, published: true };

    const post = await Post.findOne(filter);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error in getPostBySlug:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message
    });
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    console.log('createPost called with data:', req.body);
    
    const { title, excerpt, content, author, tags, published } = req.body;
    
    // Generate slug from title if not provided
    const slug = req.body.slug || createSlug(title);

    // Check if slug already exists
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return res.status(400).json({
        success: false,
        message: 'A post with this slug already exists'
      });
    }

    const post = new Post({
      title,
      slug,
      excerpt,
      content,
      author: author || 'Anonymous',
      tags: tags || [],
      published: typeof published === 'boolean' ? published : true
    });

    const savedPost = await post.save();
    console.log('Post created successfully:', savedPost._id);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: savedPost
    });
  } catch (error) {
    console.error('Error in createPost:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:slug
// @access  Private
export const updatePost = async (req, res) => {
  try {
    console.log('updatePost called for slug:', req.params.slug, 'with data:', req.body);
    
    const { title, excerpt, content, author, tags, published } = req.body;
    
    const post = await Post.findOne({ slug: req.params.slug });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Update fields
    if (title) post.title = title;
    if (excerpt) post.excerpt = excerpt;
    if (content) post.content = content;
    if (author) post.author = author;
    if (tags) post.tags = tags;
    if (typeof published === 'boolean') post.published = published;

    const updatedPost = await post.save();
    console.log('Post updated successfully:', updatedPost._id);

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    });
  } catch (error) {
    console.error('Error in updatePost:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:slug
// @access  Private
export const deletePost = async (req, res) => {
  try {
    console.log('deletePost called for slug:', req.params.slug);
    
    const post = await Post.findOneAndDelete({ slug: req.params.slug });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    console.log('Post deleted successfully:', post._id);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error in deletePost:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
};

// @desc    Get posts by tag
// @route   GET /api/posts/tag/:tag
// @access  Public
export const getPostsByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ 
      tags: tag.toLowerCase(), 
      published: true 
    })
      .select('title slug excerpt author tags publishedAt readingTime')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ 
      tags: tag.toLowerCase(), 
      published: true 
    });

    res.json({
      success: true,
      data: posts,
      tag,
      total
    });
  } catch (error) {
    console.error('Error in getPostsByTag:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts by tag',
      error: error.message
    });
  }
};

// @desc    Search posts
// @route   GET /api/posts/search?q=query
// @access  Public
export const searchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const posts = await Post.find({
      published: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ]
    })
      .select('title slug excerpt author tags publishedAt readingTime')
      .sort({ publishedAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: posts,
      query: q,
      total: posts.length
    });
  } catch (error) {
    console.error('Error in searchPosts:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching posts',
      error: error.message
    });
  }
};