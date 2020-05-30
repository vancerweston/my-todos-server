// npm module imports
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let cors = require('cors');
const uuid = require('uuid');

// application module imports
var indexRouter = require('./routes/index');

// database setup
console.log('<<-- Initiating Mongoose Test -->>');

// Connection Url
const url = 'mongodb://127.0.0.1:27017/react_todo?retryWrites=true&w=majority';

// Database Name
const dbName = 'react_todo';
let db;

/* Connect to MongoDB */
MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log('Connected successfully to Database');

    db = client.db(dbName);

    console.log('<<-- Creating todo item for database -->>');

    const collection = db.collection('todo_items');

    const todo_list = [
        {
        id: uuid(),
        _id: 1,
        name: 'Henry',
        description: 'Buy the duck flavored cat food',
        complete: false
        },
        {
        id: uuid(),
        _id: 2,
        name: 'Walter',
        description: 'Set up an appointment at the vet',
        complete: false
        },
        {
        id: uuid(),
        _id: 3,
        name: 'Car',
        description: 'Get the oil changed',
        complete: false
        }
    ];


    let save_promise_one = collection.insertMany(todo_list, { ordered: false });
    save_promise_one
        .then((saved_todo) => {
            console.log(saved_todo);
        })
        .catch((err) => {
            console.log('Error: ', err);
            console.log('<<-- The default set up todos already exist in your database -->>');
        });
});

// setting up express

var app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
