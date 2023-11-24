const mongoose = require('mongoose');
require('dotenv').config()
module.exports.connect = async () => {
  try {
    const DATABASE =process.env.DATABASE_URL

    if (!DATABASE) {
      throw new Error('DATABASE_URL is missing in the environment variables');
    }

    await mongoose.connect(DATABASE, {
      
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};
