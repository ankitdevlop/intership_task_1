const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },
  answer: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
},
  user: Object
});

module.exports = mongoose.model("Answer", answerSchema);