const express =require('express')
const router=express.Router()
const question=require('./question')
const answer=require('./answer')
const user=require('./user')
const { login, register } = require('../controller/auth')



router.use('/question',question)

router.use('/login',login)
router.use('/register',register)
router.use('/answer',answer)
router.use('/user',user)

module.exports=router