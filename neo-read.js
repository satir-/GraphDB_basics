'use strict';

const Movie = require('./models/Movie');
const MovieCast = require('./models/MovieCast');

const neo4j = require('neo4j-driver').v1;
//It is recommended to change via Neo4j Browser (:server change-password) or
//at config file (conf/neo4j-wrapper.conf), depending on the installed package
const graphDbConfig = {
	uri: 'bolt://localhost',
	user: 'neo4j',
	password: 'neo4j'
};
const driver = neo4j.driver(graphDbConfig.uri, neo4j.auth.basic(graphDbConfig.user, graphDbConfig.password));
const session = driver.session();

const main_command = require('commander');
const _ = require('lodash');

main_command
	.option('-a, --additions', 'Set this option to get additional relation info for specified movie title')
	.parse(process.argv);

if (main_command.args) {

	let relation_option = false;

	if (main_command.relation) {
		console.log('-additions flag', main_command.relation);
		relation_option = main_command.relation;
	}

	getMovie(main_command.args.pop(), relation_option)
		.then(result => {
			session.close();

			if (_.isEmpty(result.records))
				return null;

			const record = result.records[0];

			console.log('Data model instance:', new Movie(record.get('movie')));
			if (relation_option)
				console.log('Optional data model instance:', new MovieCast(record.get('movie').properties.title, record.get('cast')));

			process.exit();
		})
		.catch(error => {
			session.close();
			throw error;
		});
}

function getMovie(title, relationOption) {

	console.log('Query:', title, 'Relation option:', relationOption);

	const query = 'MATCH (movie:Movie {title: {title}}) RETURN movie LIMIT 1';
	const extended_query = 'MATCH (movie:Movie {title:{title}}) ' +
		'OPTIONAL MATCH (movie)<-[r]-(person:Person) ' +
		'RETURN movie, collect([person.name, ' +
		'head(split(lower(type(r)), \'_\')), r.roles]) AS cast LIMIT 1';

	const final_query = relationOption ? extended_query : query;

	console.log(final_query);

	return session.run(final_query, {title});
}