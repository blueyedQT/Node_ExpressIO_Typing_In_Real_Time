var path = require('path');

module.exports = function Route(app){
	app.get('/', function(req, res){
		res.render('index', {title: 'Typing in Real Time' });
	});
	var users = [];
	count=0;
	app.io.route('got_new_user', function(req){
		req.io.broadcast('new_user', {
			name: req.data.name, count: count
		});
		user = {name: req.data.name, count: count};
		users.push(user);
		req.session.name = req.data.name;
		req.session.count = count;
		count++
		req.io.emit('exisiting_users', users);
		req.io.emit('current_user', user);
	});
	app.io.route('disconnect', function(res){
		for(var i=0; i<users.length; i++) {
			var object = users[i];
			if(object.count === res.session.count) {
				app.io.broadcast('disconnect_user', object);
				users.splice(i, 1);
			}
		}
		res.session.destroy();
	});
	app.io.route('updated_text', function(req){
		req.io.broadcast('text_update', {count: req.session.count, text: req.data.text})
	})
}