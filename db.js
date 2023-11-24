const mongoose = require('mongoose');
require('dotenv').config()
module.exports.connect = async () => {
  try {
    const DATABASE ="mongodb+srv://randomdubey322:9987668202@cluster0.irtsiab.mongodb.net/?retryWrites=true&w=majority "

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
