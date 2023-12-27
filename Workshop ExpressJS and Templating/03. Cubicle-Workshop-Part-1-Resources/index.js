const express = require('express');
const hbs = require('express-handlebars').create({
    extname: '.hbs'
});
const routes = require('./routes')


const app = express();
app.engine('.hbs', hbs.engine);
app.set('view engine','.hbs');

app.use(express.urlencoded({extended: true}));
app.use('/static',express.static('static'));


app.use(routes)


app.listen(3000);