require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const blogRouter = require('./routes/blogs'); // Import blog routes
const { PORT, MONGODB_URI } = require('./utils/config'); // Import config
const errorHandler = require('./middleware/errorHandler')

const app = express();

app.use(cors());
app.use(express.json()); // Fix for undefined content.body
app.use('/api/blogs', blogRouter); // Use blog routes
app.use(errorHandler)

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err.message));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
