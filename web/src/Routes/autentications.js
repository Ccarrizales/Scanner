const express=require('express');
const router=express.Router();

module.exports=router;
router.get('/login',(req,res)=>{
    res.render('auth/login')
})