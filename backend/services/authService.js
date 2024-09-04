const mongoose = require('mongoose');
require('dotenv').config();
const { LOCAL_DB_URI,ATLAS_DB_URI } = process.env;

const connectToMongoDB = async () => {
    if (mongoose.connection.readyState === 0) { // Check if connection is not already established
        try {
            await mongoose.connect(ATLAS_DB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 10000,
            });
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }
    return mongoose.connection;
};

module.exports = {
    connectToMongoDB
};
