module.exports = function Route(app){
	app.get('/', function(req, res){
		res.render('index', {title: 'Typing in Real Time' });
	});
	var users = [];
	count=0;
	app.io.route('got_new_user', function(req){
		app.io.broadcast('new_user', {
			name: req.data.name, count: count
		});
		users.push({name: req.data.name, count: count});
		req.session.name = req.data.name;
		req.session.count = count;
		count++
		req.io.emit('exisiting_users', users);
	});
	app.io.route('disconnect', function(req){
		console.log(req);
		for(var i=0; i<users.length; i++) {
			var object = users[i];
			if(object.id === req.session.count) {
				users.splice(i, 1);
				app.io.broadcast('user_disconnected', req.session.count);
				console.log('disconnected', req.session.count);
			}
			console.log(req.session);
		}
		req.session.destroy();
	});
}