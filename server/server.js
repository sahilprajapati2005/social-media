const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); // Required for Socket.io
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const passport = require('passport'); // <--- 1. Import Passport
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// 2. Load Environment Variables
dotenv.config();

// 3. Connect to Database
connectDB();

// 4. Load Passport Config
require('./config/passport'); // <--- 2. Load the strategy we created

const app = express();
const server = http.createServer(app);

// 5. Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Your Vite Frontend URL
        methods: ["GET", "POST"],
        credentials: true
    }
});

// 6. Middlewares
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies
app.use(cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true // Allow cookies/headers to be sent
}));

// 7. Initialize Passport Middleware (Required for Google Auth)
app.use(passport.initialize()); // <--- 3. Initialize Passport

// 8. API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// 9. Socket.io Real-Time Logic
let users = []; // Keep track of online users: [{ userId, socketId }]

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
    // A. Connection
    console.log('A user connected:', socket.id);

    // B. User comes online
    socket.on("addUser", (userId) => {
        if(userId) {
            addUser(userId, socket.id);
            io.emit("getUsers", users); // Broadcast online user list to everyone
        }
    });

    // C. Sending a Message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        
        // If the receiver is online, send the message to their socket ID
        if (user) {
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text,
            });
        } 
        // Message is already saved to MongoDB via the API endpoint
    });

    // D. Disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});

// 10. Error Handling Middlewares (Must be last)
app.use(notFound);
app.use(errorHandler);

// 11. Start Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});