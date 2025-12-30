const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const Notification = require('../models/Notification');


// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        // ✅ ADD THIS CHECK: Ensure ID is a valid MongoDB ObjectId format
        // This prevents the "CastError" crash if ID is "undefined" or invalid
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = await User.findById(req.params.id).select('-password');
        
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        // This catch block will now only handle genuine server errors
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile (Bio, etc.)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update basic info from req.body
        user.username = req.body.username || user.username;
        user.bio = req.body.bio || user.bio;
        user.city = req.body.city || user.city;
        user.from = req.body.from || user.from;
        user.relationship = req.body.relationship || user.relationship;

        // Handle Image Uploads to Cloudinary
        if (req.files) {
            // Check for profile picture
            if (req.files.profilePicture) {
                const result = await cloudinary.uploader.upload(req.files.profilePicture[0].path, {
                    folder: 'social_media_profiles',
                });
                user.profilePicture = result.secure_url;
            }
            // Check for cover picture
            if (req.files.coverPicture) {
                const result = await cloudinary.uploader.upload(req.files.coverPicture[0].path, {
                    folder: 'social_media_covers',
                });
                user.coverPicture = result.secure_url;
            }
        }

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Follow or Unfollow a user
// @route   PUT /api/users/:id/follow
// @access  Private
const followUnfollowUser = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        const userToFollow = await User.findById(req.params.id);

        if (!userToFollow) return res.status(404).json({ message: 'User not found' });

        if (currentUser.following.includes(req.params.id)) {
            // Unfollow logic
            await currentUser.updateOne({ $pull: { following: req.params.id } });
            await userToFollow.updateOne({ $pull: { followers: req.user._id } });
            res.status(200).json({ isFollowing: false, message: 'User unfollowed' });
        } else {
            // Follow logic
            await currentUser.updateOne({ $push: { following: req.params.id } });
            await userToFollow.updateOne({ $push: { followers: req.user._id } });

            // ✅ ADD THIS: Create Notification for Follow
            await Notification.create({
                recipient: req.params.id, // Person being followed
                sender: req.user._id,     // Person following
                type: 'follow'
            });

            res.status(200).json({ isFollowing: true, message: 'User followed' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Search for users
// @route   GET /api/users/search?query=john
// @access  Private
const searchUsers = async (req, res) => {
  // Extract 'query' from the URL (matches ?query= in frontend)
  const { query } = req.query; 

  if (!query) {
    return res.status(200).json([]); // Return empty if no search term
  }

  try {
    const users = await User.find({
      username: { $regex: query, $options: 'i' } // 'i' makes it case-insensitive
    }).select('-password');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getFollowingList = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('following', 'username profilePicture bio');
        if (!user) return res.status(404).json({ message: "User not found" });
        
        res.status(200).json(user.following);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's followers list
// @route   GET /api/users/:id/followers
const getFollowersList = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('followers', 'username profilePicture bio');
        if (!user) return res.status(404).json({ message: "User not found" });
        
        res.status(200).json(user.followers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getSuggestions = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        
        // Find users who are NOT the current user AND NOT already in the following list
        const users = await User.find({
            _id: { 
                $ne: req.user._id,        // Not me
                $nin: currentUser.following // Not someone I already follow
            }
        })
        .select('username profilePicture bio')
        .limit(5); // Return only 5 suggestions

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // 1. Find the user. Ensure password field is included for comparison
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Use the CORRECT method name from your model: matchPassword
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        // 3. Update password. The pre-save hook handles hashing
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Password Update Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    updatePassword,
    followUnfollowUser,
    getSuggestions,
    getFollowingList,
    getFollowersList,
    searchUsers
};