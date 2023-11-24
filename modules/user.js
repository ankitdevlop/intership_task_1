const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  user: {
    type: String,
    require: true,
  },
  points: {
    type: Number,
    default: 0
  },
  badges: {
    type: Array,
    default: []
  },
  upvotedQuestions: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }
],
downvotedQuestions: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }
]
})

module.exports=mongoose.model("user",userSchema)