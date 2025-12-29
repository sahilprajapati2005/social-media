const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const passport = require('passport'); 
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// 1. Load Environment Variables & Connect DB
dotenv.config();
connectDB();

// 2. Load Passport Config
require('./config/passport'); 

const app = express();
const server = http.createServer(app);

// 3. Initialize Socket.io with Notification Support
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"],
        credentials: true
    }
});

// 4. Middlewares
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); 
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true 
}));
app.use(passport.initialize()); 

// 5. API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes')); 
app.use('/api/conversations', require('./routes/conversationRoutes'));

// 6. Socket.io Real-Time Logic
let users = []; 

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
    console.log('A user connected:', socket.id);

    // User comes online
    socket.on("addUser", (userId) => {
        if(userId) {
            addUser(userId, socket.id);
            io.emit("getUsers", users); 
        }
    });

    // C. Sending a Message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        if (user) {
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text,
            });
        } 
    });

    // ✅ ADDED: Real-time Notification Logic for Likes and Follows
    socket.on("sendNotification", ({ senderName, receiverId, type }) => {
        const receiver = getUser(receiverId);
        if (receiver) {
            // Emits to the specific receiver's socket
            io.to(receiver.socketId).emit("getNotification", {
                senderName,
                type,
            });
        }
    });

    // Disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});

// 7. Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});