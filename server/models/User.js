const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
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
            type: String,
            default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
        // --- ADDED MISSING FIELDS ---
        coverPicture: {
            type: String,
            default: "",
        },
        city: {
            type: String,
            maxLength: 50,
        },
        from: {
            type: String,
            maxLength: 50,
        },
        relationship: {
            type: String,
            enum: ['', 'Single', 'In a Relationship', 'Married'],
        },
        // ---------------------------
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
        timestamps: true,
    }
);

// Middleware: Encrypt password using bcrypt before saving to DB
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method: Check if entered password matches the hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);