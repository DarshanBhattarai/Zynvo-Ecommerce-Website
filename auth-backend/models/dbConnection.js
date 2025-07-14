const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL;

console.log('Connecting to database:', DB_URL);
mongoose.connect(DB_URL)
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });
