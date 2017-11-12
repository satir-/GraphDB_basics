
'use strict';

const _ = require('lodash');

function MovieCast(title, cast) {

	//extend and format model with internal properties of graph node
	_.extend(this, {
		title: title,
		cast: cast.map(function (c) {
			return {
				name: c[0],
				job: c[1],
				role: c[2]
			};
		})
	});
}

module.exports = MovieCast;