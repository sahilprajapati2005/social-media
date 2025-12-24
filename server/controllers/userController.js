const User = require('../models/User');

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile (Bio, etc.)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.username = req.body.username || user.username;
            user.bio = req.body.bio || user.bio; // Ensure this matches what frontend sends
            user.profilePicture = req.body.profilePicture || user.profilePicture;
            
            // --- ADD THESE UPDATES ---
            user.coverPicture = req.body.coverPicture || user.coverPicture;
            user.city = req.body.city || user.city;
            user.from = req.body.from || user.from;
            user.relationship = req.body.relationship || user.relationship;
            // ------------------------

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                bio: updatedUser.bio,
                profilePicture: updatedUser.profilePicture,
                coverPicture: updatedUser.coverPicture,
                city: updatedUser.city,
                from: updatedUser.from,
                relationship: updatedUser.relationship,
                followers: updatedUser.followers,
                following: updatedUser.following,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Follow or Unfollow a user
// @route   PUT /api/users/:id/follow
// @access  Private
const followUnfollowUser = async (req, res) => {
    try {
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }

        const currentUser = await User.findById(req.user._id);
        const userToFollow = await User.findById(req.params.id);

        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already following
        if (currentUser.following.includes(req.params.id)) {
            // Unfollow logic
            await currentUser.updateOne({ $pull: { following: req.params.id } });
            await userToFollow.updateOne({ $pull: { followers: req.user._id } });
            res.status(200).json({ message: 'User unfollowed' });
        } else {
            // Follow logic
            await currentUser.updateOne({ $push: { following: req.params.id } });
            await userToFollow.updateOne({ $push: { followers: req.user._id } });
            res.status(200).json({ message: 'User followed' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search for users
// @route   GET /api/users/search?query=john
// @access  Private
const searchUsers = async (req, res) => {
    const keyword = req.query.query
        ? {
            username: {
                $regex: req.query.query,
                $options: 'i', // Case insensitive
            },
        }
        : {};

    // Find users matching keyword, excluding the current user
    const users = await User.find({ ...keyword, _id: { $ne: req.user._id } }).select('-password');
    res.json(users);
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    followUnfollowUser,
    searchUsers,
};