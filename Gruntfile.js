/*global module:false*/
/*jshint node:true */
'use strict';

module.exports = function(grunt) {

	// Load all grunt tasks
	grunt.loadNpmTasks('assemble');
	grunt.loadNpmTasks('grunt-contrib-watch');


//--------------------------------------------------------------------------------------------------

	var conf = {

		pkg: grunt.file.readJSON('package.json'),

		//Assemble files from .hbs -contentfiles, based on data, layouts and partials
		assemble:{
			_watch:[
				'partials/*.js'
			],
			options:{
				assets:'build/',
				//data:['src/__assemble/data/**/*.{json,yml}'],
				ext:'',
				// helpers:'helpers/*.js',
				layout:'default.hbs',
				layoutdir:'layouts/',
				partials:['partials/*.*'],
				removeHbsWhitespace: true
				//collections:['pagetype']
			},
			hbs:{
				files:[
					{
						expand:true,
						cwd:'.',
						src:['*.hbs'],
						dest:'.'
					}
				]
			}
		},

		watch: {

			assemble: {
				files: '<%= assemble._watch %>',
				tasks: ['assemble'],
				options: {
					spawn: false,
					interrupt: true,
				}
			},




		},

	};


//--------------------------------------------------------------------------------------------------

	// Project configuration.
	grunt.initConfig(conf);


	grunt.registerTask('build', [
		'assemble'
	]);

	grunt.registerTask('default', [
		'build'
	]);

	grunt.registerTask('watch', [
		'build',
		'watch'
	]);


};
