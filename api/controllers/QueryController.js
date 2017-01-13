/**
 * QueryController
 *
 * @description :: Server-side logic for managing queries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	query: function(req, res, next){
		if(!req.param('query')) return res.badRequest('Missing query parameter!');
		var q = req.param('query');
		var projects = [];
		var documents = [];
		var methods = [];
		Project.find({or: [{name: {'contains': q}}, {repository: {'contains': q}}, {description: {'contains': q}}]})
		.then(function(p){
			projects = p;
			return Document.find({or: [{title: {'contains': q}}, {shortDescription: {'contains': q}}, {content: {'contains': q}}]})
		})
		.then(function(d){
			documents = d;
			return Method.find({or: [{name: {'contains': q}}, {shortDescription:{'contains': q}}, {parameters: {'contains': q}}, {returnValue: {'startsWith': q}}, {content: {'contains': q}}]})
		})
		.then(function(m){
			methods = m;
			return Tag.find({label: {'startsWith': q}});
		})
		.then(function(tags){
			var sum = projects.length + documents.length + methods.length + tags.length;
			return res.ok({total: sum, projects: projects, documents: documents, methods: methods, tags: tags});
		})
		.catch(function(err){
			return next(err);
		});
	}
};
