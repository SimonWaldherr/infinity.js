module.exports = function(grunt) {
  gzip = require("gzip-js");
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compare_size: {
      files: [ "infinity.js", "infinity.min.js" ],
      options: {
        compress: {
          gz: function( contents ) {
            return gzip.zip( contents, {} ).length;
          }
        },
        cache: ".sizecache.json"
      }
    },
    uglify: {
      options: {
        banner: '/* * * * * * * * *\n' +
                ' *  infinity.js  *\n' +
                ' * Version 0.3.0 *\n' +
                ' * License:  MIT *\n' +
                ' * SimonWaldherr *\n' +
                ' * * * * * * * * */\n\n'
      },
      dist: {
        files: {
          './infinity.min.js': ['./infinity.js']
        }
      }
    },
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        files: [
          {expand: true, src: 'infinity.min.js', dest: '/', ext: '.gz.js'}
        ]
      }
    }
  });
  grunt.loadNpmTasks("grunt-compare-size");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['uglify', 'compare_size']);
};
