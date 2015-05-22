module.exports = function ( grunt ) {
grunt.loadNpmTasks('assemble');
// Loads in any grunt tasks in the package.json file
require('load-grunt-tasks')(grunt);

var appConfig = require( './app.config.js' );
var mailConfig = require( './mail.config.js' );

var taskConfig = {

  // Clean
  // Clean files and folders.
  // https://github.com/gruntjs/grunt-contrib-clean
  clean: {
      build: [
          '<%= build_dir %>'
      ],
      compile: [
          '<%= compile_dir %>'
      ]
  },

  // grunt-contrib-watch
  // Run tasks whenever watched files change.
  // https://github.com/gruntjs/grunt-contrib-watch
  watch: {

      app_config: {
          files: 'app.config.js',
          tasks: [ 'build' ],
      },

      gruntfile: {
          files: 'Gruntfile.js',
          tasks: [ 'build' ]
      },

      assets: {
          options: {
            livereload: true
          },
          files: ['src/assets/**/*'],
          tasks: [ 'copy:build_assets' ]
      },

      html: {
          options: {
            livereload: true
          },
          files: [ '<%= app_files.html %>' ],
          tasks: [ 'assemble:build' ]
      },

      sass: {
          options: {
            livereload: true
          },
          files: [ '<%= app_files.styles %>' ],
          tasks: [ 'sass:build', 'autoprefixer:build' ]
      }
  },

  // Sass
  // Compile Sass to CSS (with libsass)
  // https://github.com/sindresorhus/grunt-sass
  sass: {
      options: {
        includePaths: ['bower_components'],
        sourceMap: true,
      },
      build: {
        files: [{
          expand: true,
          cwd: 'src/sass/',
          src: ['**/*.scss'],
          dest: '<%= build_dir %>/css/',
          ext: '.css'
        }]
      },
      compile: {
        options: {
          'sourcemap': false,
          'outputStyle': 'compressed'
        },
        files: [{
          expand: true,
          cwd: 'src/sass/',
          src: ['**/*.scss'],
          dest: '<%= compile_dir %>/css/',
          ext: '.css'
        }]
      }
  },

  // Autoprefixer
  // Parses CSS and adds vendor-prefixed CSS properties using the Can I Use database.
  // https://github.com/nDmitry/grunt-autoprefixer
  autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 9']
      },
      build: {
        options: {
          map: true,
          src: '<%= build_dir %>/css/**/*.css',
        }
      },
      compile: {
        options: {
          map: false,
          src: '<%= compile_dir %>/css/**/*.css',
        }
      },
  },

  // Copy
  // Copy files and folders.
  // https://github.com/gruntjs/grunt-contrib-copy
  copy: {
    build_assets: {
      files: [
          {
              src: [ '**' ],
              dest: '<%= build_dir %>/assets/',
              cwd: 'src/assets',
              expand: true
          }
     ]
    },
    compile_assets: {
      files: [
          {
              src: [ '**' ],
              dest: '<%= compile_dir %>/assets',
              cwd: 'src/assets',
              expand: true
          }
      ]
    },
    build_vendor: {
      files: [
          {
              src: '<%= vendor_files.css %>',
              dest: '<%= build_dir %>/css',
              expand: true,
              flatten: true
          }
      ]
    },
    compile_vendor: {
      files: [
        {
          src: '<%= vendor_files.css %>',
          dest: '<%= compile_dir %>/css',
          expand: true,
          flatten: true
        }
      ]
    }
  },

  // ImageMin
  // Minify PNG, JPEG and GIF images
  // https://github.com/gruntjs/grunt-contrib-imagemin
  imagemin: {
      compile: {
          files: [{
              expand: true,
              cwd: '<%= compile_dir %>/assets/images',
              src: ['**/*.{png,jpg,gif}'],
              dest: '<%= compile_dir %>/assets/images'
          }]
      }
  },

  // Connect
  // Start a static web server
  // https://github.com/gruntjs/grunt-contrib-connect
  connect : {
    options: {
      port: 9000,
      livereload: 35729,
      // change this to '0.0.0.0' to access the server from outside
      hostname: 'localhost'
    },
    livereload: {
      options: {
        open: 'http://localhost:9000/emails/',
        base: [
          '<%= build_dir %>'
        ]
      }
    },
    compile: {
      options: {
        open: 'http://localhost:9000/emails/',
        base: [
          '<%= compile_dir %>'
        ]
      }
    }
  },

  // HTML Min
  // Minify HTML
  // https://github.com/gruntjs/grunt-contrib-htmlmin
  // https://github.com/kangax/html-minifier#options-quick-reference
  htmlmin: {
    options: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      caseSensitive: true
    },
    compile: {
      files: [{
        expand: true,
        cwd: '<%= compile_dir %>',
        src: ['**/*.html'],
        dest: '<%= compile_dir %>'
      }]
    }
  },

  // Assemble
  // Static site generator
  // https://github.com/assemble/assemble
  assemble: {
    options: {
      flatten: true
    },
    build: {
      options: {
        layoutdir: 'src/layouts/dev',
        data: ['src/data/global.json', 'src/data/dev/*.{json,yml}'],
        partials: ['src/partials/dev/*.hbs']
      },
      src: ['src/emails/**/*.hbs'],
      dest: '<%= build_dir %>/emails/'
    },
    compile: {
      options: {
        layoutdir: 'src/layouts/production',
        data: ['src/data/global.json', 'src/data/production/*.{json,yml}'],
        partials: ['src/partials/production/*.hbs']
      },
      src: ['src/emails/**/*.hbs'],
      dest: '<%= compile_dir %>/emails/'
    },
    mailchimp: {
      options: {
        layoutdir: 'src/layouts/mailchimp',
        data: ['src/data/global.json', 'src/data/mailchimp/*.{json,yml}'],
        partials: ['src/partials/mailchimp/*.hbs']
      },
      src: ['src/emails/**/*.hbs'],
      dest: '<%= compile_dir %>/emails/'
    }
  },

  // Premailer
  // Grunt wrapper task for Premailer
  // https://github.com/dwightjack/grunt-premailer/
  premailer: {
    compile: {
      options: {
        verbose: true,
        preserveStyles: true,
        warnLevel: 'poor'
      },
      files: [{
        expand: true,
        cwd: '<%= compile_dir %>/emails',
        src: ['**/*.html'],
        dest: '<%= compile_dir %>/emails'
      }]
    }
  },

  // Process HTML
  // Process html files at build time to modify them depending on the release environment
  // https://github.com/dciccale/grunt-processhtml
  processhtml : {
    build: {
      files: [{
        expand: true,
        cwd: '<%= build_dir %>/emails',
        src: ['**/*.html'],
        dest: '<%= build_dir %>/emails'
      }]
    },
    compile: {
      files: [{
        expand: true,
        cwd: '<%= compile_dir %>/emails',
        src: ['**/*.html'],
        dest: '<%= compile_dir %>/emails'
      }]
    }
  },

  // Mailgun
  // Send emails though mailgun as part of your build. Created to test our email template builds.
  // https://github.com/markhuge/grunt-mailgun
  mailgun: {
    test: {
      options: {
        key: '<%= mailgun_options.key %>',
        sender: '<%= mailgun_options.sender %>',
        recipient: ['<%= mailgun_options.recipient %>'],
        subject: 'Congrats from the YouTube Ads Leaderboard',
        preventThreading: true
      },
      src: ['<%= compile_dir %>/emails/**/*.html']
    }
  },

  // Litmus
  // Send email tests to Litmus using Grunt
  // https://github.com/jeremypeter/grunt-litmus
  litmus: {
    options: {
      username: '<%= litmus_options.username %>',
      password: '<%= litmus_options.password %>',
      url: '<%= litmus_options.url %>',
      clients: ['androidgmailapp', 'appmail6', 'iphone5sios8', 'iphone6', 'ipadmini', 'ipad', 'chromegmailnew', 'iphone4', 'iphone5', 'ol2011', 'ol2013', 'chromeyahoo']
    },
    test: {
      src: ['<%= compile_dir %>/emails/**/*.html']
    }
  },

  // Grunt Bump
  // Increment package version.
  // https://github.com/vojtajina/grunt-bump
  bump: {
    options: {
      files: ['package.json', 'bower.json'],
      updateConfigs: [],
      commit: true,
      commitMessage: 'Release v%VERSION%',
      commitFiles: ['package.json', 'bower.json'],
      createTag: true,
      tagName: 'v%VERSION%',
      tagMessage: 'Version %VERSION%',
      push: true,
      pushTo: 'origin',
      gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
      globalReplace: false,
      prereleaseName: false,
      regExp: false
    }
  },
};

grunt.initConfig( grunt.util._.extend( taskConfig, appConfig, mailConfig ) );

grunt.registerTask( 'server', [ 'build', 'connect:livereload', 'watch' ] );
grunt.registerTask( 'default', [ 'server' ] );

grunt.registerTask('build', [
  'clean:build',
  'copy:build_assets',
  'copy:build_vendor',
  'sass:build', 'autoprefixer:build',
  'assemble:build', 'processhtml:build'
]);

grunt.registerTask('compile', function (type) {
  type = type ? type : 'compile';
  grunt.task.run('build');
  grunt.task.run('clean:compile');
  grunt.task.run('copy:compile_assets');
  grunt.task.run('imagemin:compile');
  grunt.task.run('copy:compile_vendor');
  grunt.task.run('sass:compile');
  grunt.task.run('autoprefixer:compile');
  grunt.task.run('assemble:' + type);
  grunt.task.run('processhtml:compile'); 
  grunt.task.run('premailer:compile'); 
  //grunt.task.run('htmlmin:compile');
});

grunt.registerTask('test', function (type) {
  grunt.task.run('compile');
  grunt.task.run(type + ':test');
});
};