module.exports = function( grunt ) {
  grunt.loadNpmTasks( "grunt-mocha-phantomjs" );
  grunt.loadNpmTasks( "grunt-mocha-cli" );
  grunt.loadNpmTasks( "grunt-contrib-uglify" );

  grunt.initConfig({
      // Testing in a browser
      mocha_phantomjs: {
        all: [ "tests/in-browser/index.html" ]
      },
      // Testing in Node.js
      mochacli: {
        test: {
            options: {
                reporter: "spec"
            },
            src: [ "tests/on-server/index.js" ]
        }
      },
      pkg: grunt.file.readJSON('package.json'),
      uglify: {
        options: {
          banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " +
            "<%= grunt.template.today(\"yyyy-mm-dd\") %> */"
        },
        build: {
          files: {
            "dist/byContract.min.js": [ "byContract.js" ]
          }
        }
      }
  });

  grunt.registerTask( "test", [ "mochacli", "mocha_phantomjs" ] );
  grunt.registerTask( "default", [ "test" ] );
};
