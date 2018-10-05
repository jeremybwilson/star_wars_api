var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
var path = require('path')
const axios = require('axios');

var app = express()

app.use(session({
    secret: "money",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "/static")));
app.set('views', path.join(__dirname, '/views')); 
app.set('view engine', 'ejs');


app.get('/', function (req, res){
    res.render('index');
})


app.get('/people/:arg', function(req, res){
    let x
    if(req.params.arg == 0){
        x = axios.get('http://swapi.co/api/people/')
    } else if(req.params.arg == "next"){
        x = axios.get(req.session.next)
    } else if(req.params.arg == "prev"){
        x = axios.get(req.session.previous)
    }
    x.then(data => {
        req.session.category = "/people"
        req.session.next = data.data.next
        req.session.previous = data.data.previous
        res.json(data.data);
    })
    .catch(error => {
        res.json(error);
    })
});

app.get('/planets/:arg', function(req, res){
    let x
    if(req.params.arg == 0){
        x = axios.get('http://swapi.co/api/planets/')
    } else if(req.params.arg == "next"){
        x = axios.get(req.session.next)
    } else if(req.params.arg == "prev"){
        x = axios.get(req.session.previous)
    }
    x.then(data => {
        req.session.category = "/planets"
        req.session.next = data.data.next
        req.session.previous = data.data.previous
        res.json(data.data);
    })
    .catch(error => {
        res.json(error);
    })
});

app.get('/next', function(req, res){
    res.redirect(req.session.category+"/next")
});

app.get('/prev', function(req, res){
    res.redirect(req.session.category+"/prev")
});

app.get('/all', function(req, res){
    res.redirect(req.session.category+"/0")
});








app.listen(8000, function(){
    console.log("listening on 8000")
})