const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path')
const db = require('../db/connection')
const bodyParser = require('body-parser');
const Job = require('../models/Job');
const Sequelize = require('sequelize');
const OP = Sequelize.Op;

const app = express();

const PORT = process.env.PORT || 3000;


app.listen(PORT, function () {
    console.log(`O Express está rodando na porta ${PORT}`)
});

// body parser
app.use(bodyParser.urlencoded({ extended: false }));

// handle bars
app.engine('hbs', engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));



// static folders
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: false }));

// db connection
db
    .authenticate()
    .then(() => {
        console.log("Conectou ao banco com sucesso");
    })
    .catch(err => {
        console.log("Ocorreu um erro ao conectar", err)
    });

//routes
app.get('/', (req, res) => {

    let search = req.query.job;
    let query = '%' +search+ '%'; //PH -> PHP, Word -> Wordpress, press -> Wordpress

    if (!search) {
        Job.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
        })
            .then(jobs => {
                console.log(jobs); // Verificar estrutura dos dados
                res.render('index', {
                    jobs
                });
            })
            .catch(err => console.log(err));
    } else {
        Job.findAll({
            where: {title: {[OP.like]: query}},
            order: [
                ['createdAt', 'DESC']
            ]
        })
            .then(jobs => {
                console.log(jobs); // Verificar estrutura dos dados
                res.render('index', {
                    jobs, search
                });
            })
            .catch(err => console.log(err));
    }
});
  // let query = '%' +search+ '%'; //PH -> PHP, Word -> Wordpress, press -> Wordpress

    
    app.get('/jobs', (req, res) => {
        Job.findAll({
            order: [['createdAt', 'DESC']]
        })
        .then(jobs => {
            console.log(jobs);
            res.render('jobs', { jobs });
        })
        .catch(err => console.log(err));
    });
       
//jobs routes
app.use('/jobs', require('../routes/jobs'));

module.exports = app;

