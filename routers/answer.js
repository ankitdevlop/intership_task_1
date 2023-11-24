const express = require('express');
const router = express.Router();
const Answer = require('../modules/answer');
const jwt = require('jsonwebtoken');
const Question = require('../modules/question');
const UserModel = require('../modules/user');
async function addPointsToUser(userId, pointsToAdd) {
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            console.error('User not found');
            return;
        }

        user.points += pointsToAdd;

       
        const answeredQuestionsCount = await Answer.countDocuments({ user: userId });
        const bonusPointsThreshold = 5;
        const bonusPoints = 10; 

        if (answeredQuestionsCount >= bonusPointsThreshold) {
            user.points += bonusPoints;
        }

        await user.save();
    } catch (error) {
        console.error(error);
    }
}

router.post('/:questionId', async (req, res) => {
    const { answer, user } = req.body;
    const questionId = req.params.questionId;

    try {
        // Check if the question exists
        const existingQuestion = await Question.findById(questionId);
        if (!existingQuestion) {
            return res.status(404).send('Question not found');
        }

        if (!user || !user.token) {
            return res.status(400).send('Invalid user data');
        }

        const token = user.token;
        const decodedToken = jwt.verify(token, 'secret');
        const userId = decodedToken.userId;

        const answerData = new Answer({
            answer,
            user: userId,
            question_id: questionId,
        });
        const doc = await answerData.save();

       
        existingQuestion.answers.push(doc._id); 
        await existingQuestion.save();
        
    

        const pointsToAdd = 5;
        await addPointsToUser(userId, pointsToAdd);

        res.status(201).send(doc);
    } catch (error) {
        console.log(error);
        res.status(400).send('Error in adding answer');
    }
});
router.get('/:questionId', async (req, res) => {
    const questionId = req.params.questionId;
    console.log(questionId)
    try {
        const question = await Question.findById(questionId).populate({
            path: 'answers', 
            populate: {
                path: 'user', 
                select: 'username email points', // Specify the fields you want to retrieve
            },
        });

        const answers = question;
        res.status(200).json({ answers });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;