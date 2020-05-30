var express = require('express');
var router = express.Router();
let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
const uuid = require('uuid');


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

  /* Find all Todo Items */
  const findTodoItems = function() {
    const collection = db.collection('todo_items');
    return collection.find({}).toArray();
  }

  /* Inserting New Todo Item to Database */
  const insertTodoItem = function(item) {
    const collection = db.collection('todo_items');
    return collection.insertOne(item);
  }

  const deleteTodoItem = function(id) {
    const collection = db.collection('todo_items');
    return collection.deleteOne({id});
  }

  /* GET Todo Items */
  router.get('/todos', async function(req, res, next) {
    const items = await findTodoItems();
    res.status(200).send(JSON.stringify(items, null, 2));
  });

  /* POST New Todo Item */
  router.post('/todos', async function(req, res, next) {
    await insertTodoItem({ ...req.body, id: uuid() });
    res.status(201).send(JSON.stringify(`created ${req.body}`));
  });

  /* DELETE Todo Item */
  router.delete('/todos/:todoId', async function(req, res, next) {
    await deleteTodoItem(req.params.todoId);
    res.status(200).send(JSON.stringify(`Deleted ${req.params.todoId}`));
  });

});

module.exports = router;
