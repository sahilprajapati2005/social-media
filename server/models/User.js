const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true, // Removes whitespace from ends
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profilePicture: {
            type: String, // URL to Cloudinary
            default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
        bio: {
            type: String,
            default: "Hello! I am new here.",
            maxLength: 150,
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true, // Automatically creates 'createdAt' and 'updatedAt' fields
    }
);

// Middleware: Encrypt password using bcrypt before saving to DB
userSchema.pre('save', async function (next) {
    // If password is not modified (e.g., updating bio only), skip hashing
    if (!this.isModified('password')) {
        next();
    }

    // Generate a "salt" (random data to make hash unique)
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    this.password = await bcrypt.hash(this.password, salt);
});

// Method: Check if entered password matches the hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);