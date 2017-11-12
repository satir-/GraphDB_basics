#!/usr/bin/env node

'use strict';

const main_command = require('commander');

//first approach (options)
// main_command
// 	.version('0.0.1')
// 	.option('-a, --all', 'option description')
// 	.option('-m, --more', 'we can have as many options as we want')
// 	.option('-i, --input [optional]', 'optional user input')
// 	.option('-I, --required <required>', 'required user input')
// 	.parse(process.argv); // end with parse to parse through the input
//
//
// console.log('Your input:');
// if (main_command.all) console.log('- all', main_command.all);
// if (main_command.more) console.log('- more', main_command.more);
// if (main_command.input) console.log('- %s - input', main_command.input);
// console.log('- %j - required input', main_command.required);

//second approach (sub commands)
main_command
	.version('0.0.1')
	.description('CLI manager for basic CRUD actions with Neo4j database.')
	.command('create <query>', 'create node').alias('c')
	.command('read [query]', 'get data, with optional parameters').alias('r')
	.command('update <query>', 'update node').alias('u')
	.command('delete <query>', 'delete node').alias('d')
	.parse(process.argv);

if (main_command.args.length === 0) main_command.help();