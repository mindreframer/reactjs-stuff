module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-karma');

    // Do grunt-related things in here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        react: {
            dynamic_mappings: {
                files: [
                    {
                        expand: true,
                        src: ['src/**/*.jsx', "test/**/*.jsx"],
                        dest: 'build_jsx/',
                        ext: '.js'
                    }
                ]
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        }


    });


    grunt.registerTask('build', ['react']);
    grunt.registerTask('test', ['build', 'karma']);

};