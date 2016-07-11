var express = require("express");
var app = express();
var pg = require("pg");

var dbConfig = {
  user: 'ubuntu',
  database: 'fake_store',
  password: 'password123',
  max: 10,
  idleTimeoutMillis: 30000
};

var pool = new pg.Pool(dbConfig);

app.get('/items', function(request, response) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
  
    client.query('SELECT * FROM items', function(err, result) {
      done();
    
      if(err) {
        return console.error('error running query', err);
      }
    
      console.log(result.rows);
      
      response.status(201).json(result.rows);
    
    });
  
    pool.on('error', function (err, client) {
      // if an error is encountered by a client while it sits idle in the pool
      // the pool itself will emit an error event with both the error and
      // the client which emitted the original error
      // this is a rare occurrence but can happen if there is a network partition
      // between your application and the database, the database restarts, etc.
      // and so you might want to handle it and at least log it out
      console.error('idle client error', err.message, err.stack);
    });
  
  });  

  
});


app.use(express.static(__dirname + '/public'));

var config = {
    port: process.env.PORT || 8080
};

app.listen(config.port, function() {
    console.log(`Server listening on port: ${config.port}`);
});