'use strict';

var gulp = require('gulp'),
    uglifyjs2 = require( 'gulp-uglify' ),
    sass = require( 'gulp-sass' ),
    autoprefixer = require( 'gulp-autoprefixer' ),
    cleancss = require( 'gulp-clean-css' ),
    concat = require( 'gulp-concat' ),
    header = require( 'gulp-header' ),
    rename = require( 'gulp-rename' );

var pkg = require( './package.json' );


// Header
// -----------------------------------------------------------------------------

var jsHeader = [
  '/**',
  ' * Droppy - v<%= pkg.version %>',
  ' * <%= pkg.description %>',
  ' * By <%= pkg.author %>, license <%= pkg.license %>.',
  ' * <%= pkg.repository.url %>',
  ' */\n'
].join( '\n' );


// Path
// -----------------------------------------------------------------------------

// Source path.
var src = {

  // JavaScript path.
  js: {
    glob: [
      './js/shims/**/*.js',
      './js/droppy.js'
    ]
  },

  // Scss path.
  scss: {
    glob: './styles/scss/**/*.scss'
  },

  // Css path.
  css: {
    glob: './styles/css/**/*.css'
  },

  // Test path.
  test: {
    glob: './test/styles/scss/**/*.scss'
  }
};

// Destination path.
var dest = {

  dist: './dist',
  css: './styles/css',
  test: './test/styles/css'
};


// Options
// -----------------------------------------------------------------------------

var opts = {

  // Sass options.
  sass: {
    errLogToConsole: true,
    outputStyle: 'expanded'
  },

  // Autoprefixer options.
  autoprefixer: {
    browsers: [ 'ie >= 9' ]
  },

  // UglifyJS2 options.
  uglifyjs2: {
    preserveComments: 'license'
  }
};


// Tasks
// -----------------------------------------------------------------------------

// Compile scss.
gulp.task( 'sass', function() {
  return gulp.src( src.scss.glob )
    .pipe( sass( opts.sass ) ).on( 'error', sass.logError )
    .pipe( autoprefixer( opts.autoprefixer ) )
    .pipe( gulp.dest( dest.css ) )
} );

// Minify css.
gulp.task( 'css', [ 'sass' ], function() {
  return gulp.src( src.css.glob )
    .pipe( concat( 'droppy.css' ) )
    .pipe( gulp.dest( dest.dist ) )
    .pipe( cleancss() )
    .pipe( rename( { extname: '.min.css' } ) )
    .pipe( gulp.dest( dest.dist ) )
} );

// Call to scss and css.
gulp.task( 'style', [ 'css' ] );

// Compile test scss.
gulp.task( 'test', function() {
  return gulp.src( src.test.glob )
    .pipe( sass( opts.sass ) ).on( 'error', sass.logError )
    .pipe( autoprefixer( opts.autoprefixer ) )
    .pipe( gulp.dest( dest.test ) )
} );

// Minify js.
gulp.task( 'js', function() {
  return gulp.src( src.js.glob )
    .pipe( concat( 'droppy.js' ) )
    .pipe( header( jsHeader, { pkg: pkg } ) )
    .pipe( gulp.dest( dest.dist ) )
    .pipe( uglifyjs2( opts.uglifyjs2 ) )
    .pipe( rename( { extname: '.min.js' } ) )
    .pipe( gulp.dest( dest.dist ) )
} );

// Prepare for distribution.
gulp.task( 'dist', [ 'style', 'js', 'test' ] );

// Default task.
gulp.task( 'default', [ 'dist' ] );
