const express=require('express');
const router=express.Router();
const pool=require('../database');

router.get('/',async(req,res)=>{
    const guias=await pool.query('SELECT Id,NumeroGuia,Alto,Ancho,Largo,Peso,Fecha FROM `tbl_paquetes`');
    console.log(guias);
    res.render('index/index',{guias});
    
});
module.exports=router;