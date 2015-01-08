module.exports = function Route(app){
	app.get('/', function(req, res){
		res.render('index', {title: 'Typing in Real Time' });
	});
	var users = [];
	app.io.route('got_new_user', function(req){
		app.io.broadcast('new_user', req.data.name);
		users.push(req.data.name);
		console.log(users);
		req.io.emit('exisiting_users', users);
	});
}