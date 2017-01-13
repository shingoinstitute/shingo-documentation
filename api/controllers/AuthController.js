/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require('passport');

module.exports = {
	login: function(req,res,next){
		req.session.path = req.query.path;
		passport.authenticate('forcedotcom')(req,res,next)
	},
	token: function(req, res, next){
		passport.authenticate('forcedotcom', function(err, user, info, state){
			sails.log.debug('err', err)
			if(err) return next(err);
			req.session.user = user;
			req.session.authenticated = user._raw.asserted_user;
			var path = req.session.path;
			sails.log.debug('path', path);
			return res.redirect('/' + (path ? '#' + path : ''));
			req.session.path = null;
		})(req,res,next);
	},
	logout: function(req,res,next){
		req.session.authenticated = false;
		req.session.user = null;
		return res.redirect('/');
	},
	me: function(req,res,next){
		res.ok(req.session.user);
	}
};
