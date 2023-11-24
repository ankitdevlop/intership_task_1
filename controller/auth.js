const bcrypt =require ('bcryptjs');
const jwt = require ('jsonwebtoken');
 // Make sure to provide the correct path to your User model
const user = require('../modules/user');

 const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const existingUser = await user.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({ error: 'User not found' });
        }

        const isPasswordValid =  bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ _id: existingUser._id.toString() }, 'secret');

        res.status(200).json({ token ,email,});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

 const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingUser = await user.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new user({
            email,
            password: hashedPassword,
            username,
        });

        const savedUser = await newUser.save();

        const token = jwt.sign({ _id: savedUser._id.toString() }, 'secret');

        res.status(201).json({ token ,email,username});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
module.exports={
    login,
    register
}