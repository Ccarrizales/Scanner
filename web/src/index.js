const express=require('express');
const morgan =require('morgan');
const handlebars=require('express-handlebars');
const path=require('path');

//initializacion
const app= express();

//settings
app.set('port',process.env.PORT|| 4000);
app.set('views',path.join(__dirname,'views'));
app.engine('.hbs',handlebars({
    defaultLayouts:'main',
    layoutDir:path.join(app.get('views'), 'layouts'),
    partialsDir:path.join(app.get('views'),'partials'),
    extname:'.hbs',
    helpers:require('./lib/handlebars')
}));
app.set('view engine', '.hbs');
app.use(express.json());

//midelware
app.use(morgan('dev'));

///rutas
app.use(require('./Routes'));
app.use(require('./Routes/autentications'));
app.use('/links',require('./Routes/links'));

//public
app.use(express.static(path.join(__dirname,'Public')));


app.listen(app.get('port'), ()=>{
console.log('server on port',app.get('port'));
});

