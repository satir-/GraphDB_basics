'use strict';

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

main_command
	.option('-r, --relation', 'set relation')
	.parse(process.argv);

console.log('Your input:');
// if (main_command.args) console.log('create', main_command.args);
if (main_command.relation) console.log('-relation', main_command.relation);

//transaction usage
const resultPromise = session.writeTransaction(tx => tx.run(
	'CREATE (a:Greeting) SET a.message = $message RETURN a.message + ", from node " + id(a)',
	{message: 'Hello world! And even more - ' + main_command.args.pop()}));

resultPromise.then(result => {
	session.close();

	const singleRecord = result.records[0];
	const greeting = singleRecord.get(0);

	console.log(greeting);

	// on application exit:
	driver.close();
});