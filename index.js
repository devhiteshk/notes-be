const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project');
const fileRoutes = require('./routes/file');
const chatRoutes = require("./routes/gpt");
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Passport config
require('./config/passport')(passport);

// Connect Database
connectDB();

// Rate Limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        status: 429,
        error: 'Too many requests, please try again later.',
    },
});

// Apply rate limiter to all requests
app.use('/api/', apiLimiter);
app.use('/auth/', apiLimiter);

// Init Middleware
app.use(cors({ origin: ['https://notes.codehoody.com/', 'http://localhost:5173'] }));
app.use(express.json());
app.use(passport.initialize());

// Define Routes
app.use('/auth', authRoutes);
app.use('/api', projectRoutes);
app.use('/api', fileRoutes);
app.use('/api', chatRoutes);
app.use('/ping', (req, res) => {
    res.send({ status: "server is running", success: true });
});

const PORT = process.env.PORT || 911;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
