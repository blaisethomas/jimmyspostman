const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = 3000;

var app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

// Create mongoose schema
var bookSchema = mongoose.Schema({
  name: String,
  year: Number
});

// Create mongoose model
var Book = mongoose.model('Book', bookSchema);

// Connect to database
var dbName = 'my_postman'
mongoose.connect('mongodb://localhost/' + dbName, function(err) {
  if (err) throw "Could not connect check if mongod is running";
  else console.log("Succesfully connected to: " + dbName + " database");
});

// Send the index file
app.get('/', function(req, res) {
  res.sendFile('index.html', {root: __dirname});
});

// Send all the books
app.get('/books', function(req, res) {
  Book.find({}, function(err, books){
    if (err){
      console.error(err);
      return res.send("Something went wrong with your request!");
    } else { // Everything went fine, send all the books found
      res.json(books);
    }
  })
});

// Save a new book
app.post('/books', function(req, res){
  console.log(req.body);
  Book.create(req.body, function(err, freshlyCreatedBook){
    if (err) {
      console.error(err);
      res.send("Something went wrong with your request!");
    } else {// Everything went fine, send the  book that just got saved
      res.json(freshlyCreatedBook); 
    }
  })
});

// Catch all the rest of requests
app.all('*', function(req, res){
  console.log('Request received method:', req.method, ', url:', req.url, ', body:', req.body);
  res.json({message: 'the server has not specified a route for method: ' + req.method + ', url:' + req.url});
});

app.listen(PORT, function() {
  console.log('Server started on port: ' + PORT);
  console.log('Script is located at: ' + __dirname);
});
