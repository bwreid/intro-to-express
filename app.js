var express = require('express');
var app = express();
var groceries = require('./groceries');

app.get('/', function (req, res, next) {
  res.send('Hello World');
});

app.get('/new', function (req, res, next) {
  res.send('Reload!!!');
});

app.get('/vegetables', function (req, res, next) {
  var vegetables = groceries.vegetables;
  if ( req.query.search ) {
    vegetables = groceries.vegetables.filter(function (vegetable) {
      return vegetable.toLowerCase().indexOf(req.query.search.toLowerCase()) > -1;
    });
  }

  res.send(vegetables.join(', '));
});

app.get('/vegetables/:id', function (req, res, next) {
  res.send(groceries.vegetables[req.params.id]);
});

app.post('/vegetables', function (req, res, next) {
  var body = [];
  req.on('data', function (chunk) {
    body.push(chunk.toString());
  }).on('end', function () {
    var status = 422;
    var vegetable = JSON.parse(body.join('')).name;
    var uniq = !groceries.vegetables
                         .map((vegetable) => vegetable.toLowerCase())
                         .includes(vegetable.toLowerCase());

    if ( uniq ) {
      groceries.vegetables.push(vegetable);
      status = 201;
      console.log(vegetable, uniq, groceries.vegetables);
    }
    res.status(status).send();
  });
});

app.get('/*', function (req, res) {
  res.status(404).send('Nope! Nothing here.');
});

app.listen(3000, function () {
  console.log('Starting a server on http://localhost:3000');
});
