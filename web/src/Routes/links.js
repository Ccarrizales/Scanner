const express=require('express');
const router=express.Router();
const pool=require('../database');
const fastcsv=require('fast-csv');
const fs=require('fs');
const ws=fs.createWriteStream("FletexScann.csv");
const filesaver=require('file-saver');
const { Result } = require('express-validator');
const { constants } = require('buffer');


module.exports=router;
router.get('/add',(req,res)=>{
    res.render('links/add');
   });

router.post('/add',(req, res)=>{
    res.send('recevide');
});

router.get('/',async(req,rest)=>{
    const guias=await pool.query('SELECT Id,NumeroGuia,Alto,Ancho,Largo,Peso,Fecha FROM tbl_paquetes');
    console.log(guias);
    rest.render('links/list',{guias})
});

//create excel
router.get('/links',async(req,res)=>{
    
 const generarexcel=await pool.query('SELECT Id,NumeroGuia,Alto,Ancho,Largo,Peso,Fecha FROM `tbl_paquetes',function(error,data,fields){
     if(error)throw error;
     const jsonData=JSON.parse(JSON.stringify(data));
     console.log("JsonData",jsonData);
     fastcsv
     .write(jsonData,{headers:true})
     .on("finish",function(){
         res.send("<a href='/FletexScann.csv' download='FletexScann.csv' id='download-link'></a><script>document.getElementById('download-link').click();</script>")
         console.log("se ha creado satisfactorio");
     })
     .pipe(ws);
  });
 console.log(generarexcel);
res.redirect('/links');
});

router.get('/get',async(req,rest)=>{
 const {get}=req.params;
 console.log(get);
 await pool.query('SELECT NumeroGuia,Alto,Ancho,Largo,Peso,Fecha FROM tbl_paquetes',(err,rows,fields)=>{
    if(!err){
        rest.json(rows);

    }else{
        console.log(err);
    }
    });

});
//fechas
router.get('/links', async(req,rest)=>{
    const {date1}=Date.parse("Y-m-d")
    const {date2}=Date.parse("y-m-d")
   
    var query='SELECT * FROM `tbl_paquetes` WHERE `Fecha` BETWEEN Fecha=? AND fecha=?'
   const consultafechas=await pool.query(query,[date1,date2],(err,rows,field)=>{
        console.log(consultafechas)
        if(!err){
            rest.json(rows);
            rest.render("links/",{consultafechas})
        }else{
            console.log(err);
        }
    });

});
//paginacion


router.post('/post',async(req,rest)=>{

    const {Id,Iduser,NumeroGuia,IdCliente,Alto,Ancho,Largo,Peso,Fecha}=req.body;
    
    console.log(req.body)
    const envio=req.body;
    const query=`
    CALL addOReditcampo(?,?,?,?,?,?,?,?,?);
    `;
    pool.query('INSERT INTO tbl_paquetes SET ?',envio,(err,rows,field)=>{
       if(!err)
       {
         rest.json({Status:"Datos guardados"});
       }else{
           console.log(err);
           rest.send(err.sqlMessage);
       }
       });
       
});