
'use strict';

const _ = require('lodash');

function Movie(_node) {
	//extend with internal properties of graph node
	_.extend(this, _node.properties);

	if (this.id) {
		this.id = this.id.toNumber();
	}
	if (this.duration) {
		this.duration = this.duration.toNumber();
	}
}

module.exports = Movie;