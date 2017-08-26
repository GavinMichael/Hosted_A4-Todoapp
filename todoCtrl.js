module.exports = function(app) {

	// Import Body Parser
	var bodyParser = require('body-parser');
	// create application/x-www-form-urlencoded parser
	var urlencodedParser = bodyParser.urlencoded({extended: false});
	var path = require('path');
	app.use(bodyParser.json());
	
	// Import Mongoose
	var mongoose = require('mongoose');
	// DB Credentials
	var username = 'admin';
	var password = 'admin';
	// Connect to the DB
	mongoose.connect('mongodb://' + username + ':' + password + '@ds153003.mlab.com:53003/angular4_todo_app_db');

	// ROUTES
	
	// Serving the index page
	app.get('/', serveIndex);
	// Serving the to do items
	app.get('/api/todos', fetchTodos);
	// Add a new to do
	app.post('/api/todos', addTodoItem);
	// Delete a to do
	app.delete("/api/todos/:id", deleteTodoItem);
	// Update request
	app.put('/api/todos/update/:id', updateTodoItem)

	// Serving the index page
	function serveIndex(req, res) {
		res.sendFile(path.join(__dirname + '/dist/index.html'));
	}

	// Serving the to do items
	function fetchTodos(req, res) {
		TodoModel.find(function (err, items) {
			if (err) return console.error(err);
			try {
				res.send(items);
			} catch(err) {
				console.log(err.message);
			}
		});
	}

	// Date
    let date = new Date(	);
	let currDate = date.toDateString();
	
	// To Do schema
	var TodoSchema = mongoose.Schema({
		title: { type: String, required: false },
		desc: { type: String, required: false },
		label: { type: String },
		priority: { type: String, default: 'Normal' },
		addedOn: { type: Date, default: currDate },
		completedOn: { type: Date },
		status: { type: String, default: 'Active' },
	});
	
	// To Do model created from the schema
	var TodoModel = mongoose.model("TodoModel", TodoSchema);

	// Add a new to do
	function addTodoItem(req, res) {		
		TodoModel(req.body).save(function (err, item) {
			if (err){
				throw err;
			}
			//sends back the item that was added with it's id
			res.send(item);
		});
	} // end of addTodoItem function

	// Delete a to do
	function deleteTodoItem(req, res) {
		TodoModel.remove({_id: req.params.id}, function (err) {
			if (err) return console.error(err);
			console.log(req.params.id)
			fetchTodos(req, res);
		});
	} // End of Delete a to do

	// Update a todo
	function updateTodoItem(req, res) {
		var id = req.params.id;
		var conditions = { _id: id };
		// TodoModel.findOne({_id: id}, function(err, foundObject) {
		// 	if (err) {
		// 		console.log(err);
		// 		res.status(500).send();
		// 	} else {
		// 		if (!foundObject) {
		// 			res.status(404).send(); 
		// 		} else {
		// 			foundObject = res.body;
		// 		}

		// 		foundObject.save(function(err, updatedObject){
		// 			if(err) {
		// 				console.log(err);
		// 			} else {
		// 				res.send(updatedObject);
		// 			}
		// 		})
		// 	}
		// })

		TodoModel.update(conditions, req.body)
			.then(doc => {
				console.log(req.body);
				if (!doc) {
					return res.status(404).end();
				} else {
					return res.status(200).json(doc);
				}
			})
			.catch(err => console.log(err));

	} // End of Update a to do
	
};