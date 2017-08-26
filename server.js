// Import Express
const express = require('express');
// Import CORS
var cors = require('cors')
const app = express();
var path = require('path');

app.use(cors());

// Import the controller
require('./todoCtrl')(app);


// Defining public folder
app.use(express.static(path.join(__dirname, '/dist')));

// Setting the rendering engine to EJS
app.set('view engine', 'ejs');

var port = process.env.PORT || 3000;
// Start app and listen on port
app.listen(port, function () {
	console.log('Server Started on port ' + port);
});
