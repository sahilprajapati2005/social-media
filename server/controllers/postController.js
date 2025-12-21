const Post = require('../models/Post');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        let imageUrl = '';

        // Upload image to Cloudinary if file exists
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'social_media_app',
            });
            imageUrl = result.secure_url;
        }

        const post = await Post.create({
            user: req.user._id,
            caption,
            image: imageUrl,
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all posts (Feed)
// @route   GET /api/posts
// @access  Private
const getFeedPosts = async (req, res) => {
    try {
        // Logic: Get posts from current user + users they follow
        // For simplicity now: Get ALL posts sorted by newest
        const posts = await Post.find()
            .populate('user', 'username profilePicture') // Get post owner details
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Like a post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if post is already liked
        if (post.likes.includes(req.user._id)) {
            // Unlike (Remove userId from likes array)
            post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
        } else {
            // Like (Add userId to likes array)
            post.likes.push(req.user._id);
        }

        await post.save();
        res.status(200).json(post.likes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPost, getFeedPosts, likePost };