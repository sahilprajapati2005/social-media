const Post = require('../models/Post');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const fs = require('fs'); // Import FS to delete local files after upload

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        let imageUrl = '';

        // Upload image to Cloudinary if file exists
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'social_media_app',
                });
                imageUrl = result.secure_url;

                // FIX: Delete the local file after upload to save space
                fs.unlinkSync(req.file.path); 
            } catch (uploadError) {
                console.error("Cloudinary Error:", uploadError);
                return res.status(500).json({ message: "Image upload failed" });
            }
        }

        const post = await Post.create({
            user: req.user._id,
            caption,
            image: imageUrl,
        });

        // Populate user details immediately so frontend can display it
        await post.populate('user', 'username profilePicture');

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all posts (Feed)
// @route   GET /api/posts/feed
// @access  Private
const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'username profilePicture') // Get post owner
            // FIX: Also populate comments and the users who wrote them
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username profilePicture'
                }
            })
            .sort({ createdAt: -1 }); // Newest first

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
            // Unlike
            post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
        } else {
            // Like
            post.likes.push(req.user._id);
        }

        await post.save();
        res.status(200).json(post.likes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comment
// @access  Private
const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        const comment = {
            user: req.user._id,
            text,
            createdAt: new Date()
        };

        post.comments.push(comment);
        await post.save();

        // Re-fetch to populate user details for the new comment
        const updatedPost = await Post.findById(req.params.id).populate({
            path: 'comments',
            populate: { path: 'user', select: 'username profilePicture' }
        });

        res.status(201).json(updatedPost.comments); // Return all comments
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    createPost, 
    getFeedPosts, 
    likePost,
    addComment 
};