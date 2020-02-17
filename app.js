var express = require('express');
var mongoose = require("mongoose");
var app = express();
var bodyParser = require("body-parser");
var path = require('path');
var http = require('http');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersNotes = require('./routes/notesRouter');

const host = '127.0.0.1';
const port = 8080;

global.__basedir = __dirname;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(cors());

app.set('view engine', 'ejs');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

app.use("/public", express.static(__dirname + '/public'));

app.use('/', indexRouter);
app.use('/api/notes', usersNotes);


// 404 error
app.use(function (req, res, next) {
  res.status(404).send("Not Found")
});


mongoose.connect("mongodb+srv://admin:93Mifode@cluster0-al7vx.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true }, function(err){
  if(err) return console.log(err);
  http.createServer(app).listen(port, host, function () {
    console.log(`Server listens http://${host}:${port}`);
  });
});
