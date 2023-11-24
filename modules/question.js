const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: String,
    
    body: String,
    tags: [],
    created_at: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    points: {
        type: Number,
        default: 0
    },
    upvotes: {
        type: [mongoose.Schema.Types.ObjectId], // assuming user IDs are stored in these arrays
        default: [],
      },
      downvotes: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
      },
    
      answers: {type:[ mongoose.Schema.Types.ObjectId], ref: 'Answer'
     },
      
});

module.exports = mongoose.model('Question', questionSchema);