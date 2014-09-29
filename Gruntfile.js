module.exports = function(grunt) {
    grunt.initConfig({
        simplemocha: {
            options: {
                globals: ['should'],
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'list'
            },
            all: { src: ['test/**/*.js'] }
        },

        jshint: {
            all: [ 'Gruntfile.js', 'index.js', 'lib/**/*.js', 'test/**/*.js']
        },

        jsdoc: {
            all: {
                src: ['index.js', 'lib/**/*.js'],
                dest: 'doc'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('test', ['simplemocha:all']);
    grunt.registerTask('build', ['jshint', 'test']);
    grunt.registerTask('default', ['build', 'jsdoc']);
};
