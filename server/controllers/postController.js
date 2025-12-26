const Post = require('../models/Post');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        let imageUrl = '';

        // Added a safety check to see if req.file exists before accessing .path
        if (req.file) { 
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'social_media_app',
            });
            imageUrl = result.secure_url;
            
            // Delete the local file after successful upload
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path); 
            }
        }

        const post = await Post.create({
            user: req.user._id,
            caption: caption || " ", // Ensure caption isn't an empty string to pass validation
            image: imageUrl, 
        });

        await post.populate('user', 'username profilePicture');
        res.status(201).json(post);
    } catch (error) {
        console.error("Create Post Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all posts for the Feed
// @route   GET /api/posts/feed
// @access  Private
const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'username profilePicture') // Get post owner info
            .populate({
                path: 'comments.user', // Populate user info for each comment
                select: 'username profilePicture'
            })
            .sort({ createdAt: -1 }); // Newest posts at the top

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Like or Unlike a post
// @route   PUT /api/posts/:id/like
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Toggle Like: Remove if already exists, add if it doesn't
        if (post.likes.includes(req.user._id)) {
            post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
        } else {
            post.likes.push(req.user._id);
        }

        await post.save();
        res.status(200).json(post.likes); // Return updated likes array
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        const newComment = {
            user: req.user._id,
            text,
            createdAt: new Date()
        };

        post.comments.push(newComment);
        await post.save();

        // Populate and return only the comments array
        const updatedPost = await Post.findById(req.params.id).populate('comments.user', 'username profilePicture');
        res.status(201).json(updatedPost.comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all posts from a specific user for their profile page
// @route   GET /api/posts/profile/:id
const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.id })
            .populate('user', 'username profilePicture')
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getComments = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate({
                path: 'comments.user',
                select: 'username profilePicture'
            });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post.comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { 
    createPost, 
    getFeedPosts, 
    likePost,
    addComment,
    getComments,
    getUserPosts
};