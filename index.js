const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project');
const fileRoutes = require('./routes/file');
const chatRoutes = require("./routes/gpt")
const cors = require('cors')
require('dotenv').config();

const app = express();

// Passport config
require('./config/passport')(passport);

// Connect Database
connectDB();

// Init Middleware
app.use(cors())
app.use(express.json());
app.use(passport.initialize());

// Define Routes
app.use('/auth', authRoutes);
app.use('/api', projectRoutes);
app.use('/api', fileRoutes);
app.use('/api', chatRoutes);
app.use('/ping', (req, res) => {
    res.send({ status: "server is running", success: true })
})

const PORT = process.env.PORT || 911;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
