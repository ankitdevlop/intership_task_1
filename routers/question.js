const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();
const QuestionDB = require('../modules/question');
const UserModel = require('../modules/user'); // Assuming you have a User model

router.get('/', async (req, res) => {
  try {
      const questions = await QuestionDB.find().populate('user', 'username email');
    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:id', async (req, res) => {
  const questionId = req.params.id;
  try {

    const question = await QuestionDB.findById(questionId).populate('user', ' email');
    
    if (!question) {
      return res.status(404).send('Question not found');
    }

    res.status(200).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/', async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.body.user.token, 'secret');
    const userId = decodedToken._id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const QuestionData = new QuestionDB({
      title: req.body.title,
      body: req.body.body,
      tags: req.body.tags,
      user: userId,
    });

    const savedQuestion = await QuestionData.save();

 
    const populatedQuestion = await QuestionDB.findById(savedQuestion._id).populate('user', 'username email');

  
    

    await user.save();

    const responsePayload = {
      savedQuestion: populatedQuestion,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    };

    res.status(201).json(responsePayload);
  } catch (error) {
    console.error(error);
    res.status(400).send('Error in adding question');
  }
});

//  upvote and downvootes 
router.post('/:id/upvote', async (req, res) => {
  const questionId = req.params.id;
  try {
    const decodedToken = jwt.verify(req.body.user.token, 'secret');
    const userId = decodedToken._id;

    const question = await QuestionDB.findById(questionId);
    const user = await UserModel.findById(userId);

    if (!question || !user) {
      return res.status(404).send('Question or user not found');
    }

 
    if (user.upvotedQuestions.includes(questionId)) {
      return res.status(400).send('User has already upvoted');
    }

    
    if (user.downvotedQuestions.includes(questionId)) {
      const index = user.downvotedQuestions.indexOf(questionId);
      user.downvotedQuestions.splice(index, 1);
      question.points += 1;
    }


    question.upvotes.push(userId);

    
    question.points += 1;

   
    user.upvotedQuestions.push(questionId);

    if (question.upvotes.length === 5) {
      question.points += 9; 
      user.poi
    }

    await question.save();
    await user.save();

    res.status(200).json({ message: 'Upvoted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/:id/downvote', async (req, res) => {
  const questionId = req.params.id;
  console.log(req.body.user.token)
  try {
      const decodedToken = jwt.verify(req.body.user.token, 'secret');
      const userId = decodedToken._id;

      const question = await QuestionDB.findById(questionId);
      const user = await UserModel.findById(userId);

      if (!question || !user) {
          return res.status(404).send('Question or user not found');
      }

      if (user.downvotedQuestions.includes(questionId)) {
          return res.status(400).send('User has already downvoted');
      }

      
      if (user.upvotedQuestions.includes(questionId)) {
          const index = user.upvotedQuestions.indexOf(questionId);
          user.upvotedQuestions.splice(index, 1);
          question.points -= 1; // Adjust points if needed
      }

   
      question.downvotes.push(userId);

      
      question.points -= 1;

    
      user.downvotedQuestions.push(questionId);

      await question.save();
      await user.save();

      res.status(200).json({ message: 'Downvoted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
