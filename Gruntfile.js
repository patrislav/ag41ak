
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      options: {
        // 'no-write': true
        force: true
      },
      all: ["export/**/*"]
    },
    copy: {
      main: {
        files: [
          { expand: true, cwd: 'assets/', src: '**', dest: 'export/assets/' },

          { expand: true, cwd: 'public/', src: '**', dest: 'export/' }
        ]
      }
    },
    typescript: {
      base: {
        src: [
          'source/**/*.ts',
          'source/**/*.tsx',
          'typings/**/*.ts'
        ],
        dest: 'export/scripts/app',
        options: {
          target: "es5",
          module: "amd",
          moduleResolution: "node",
          sourceMap: true,
          removeComments: true,
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          noImplicitAny: false,
        }
      }
    }
  });

  // Synchronisation of files
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Typescript compiler
  grunt.loadNpmTasks('grunt-typescript');

  // Default task(s).
  grunt.registerTask('default', ['clean', 'copy', 'typescript']);

};
