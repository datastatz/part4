require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const blogRouter = require('./routes/blogs'); // Import blog routes
const { PORT, MONGODB_URI } = require('./utils/config'); // Import config
const errorHandler = require('./middleware/errorHandler')
const usersRouter = require('./controllers/users')

const app = express();

app.use(cors());
app.use(express.json()); // Fix for undefined content.body
app.use('/api/blogs', blogRouter); // Use blog routes
app.use(errorHandler)
app.use('/api/users', usersRouter);




console.log(`Connecting to MongoDB: ${MONGODB_URI}`)



// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err.message));


if (process.env.NODE_ENV !== 'test') {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
}


module.exports = app; // Export for testing