const express = require('express');
const app = express();

const PORT = 3001;

app.use(express.static(__dirname + '/public'));

app.get('/', function(request,response){
  response.sendFile('index.html');
}).listen(PORT);
