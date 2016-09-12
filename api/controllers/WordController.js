/**
 * WordController
 *
 * @description :: Server-side logic for managing words
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');

module.exports = {
	
	words: function(req, res) {
		fs.readFile("assets/data/enWords.txt", function(err,data) {
			res.send(data.toString().split("\n"));
 		})
	}
};

