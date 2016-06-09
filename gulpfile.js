var gulp = require( 'gulp' ),
    uglifyjs2 = require( 'gulp-minify' ),
    sass = require( 'gulp-sass' ),
    autoprefixer = require( 'gulp-autoprefixer' ),
    cssnano = require( 'gulp-cssnano' ),
    concat = require( 'gulp-concat' ),
    rename = require( 'gulp-rename' );


// Path
// -----------------------------------------------------------------------------

var path = {

  // Distribution path.
  dist: './dist',

  // JavaScript path.
  js: [
    './js/*.js',
    // Shims
    './js/shims/classList.js/classList.js'
  ],

  // Styles path.
  styles: {
    sass: [ './styles/scss/**/*.scss' ],
    css: [ './styles/css/**/*.css' ],
    output: './styles/css'
  },

  // Test path.
  test: {
    sass: [ './test/style.scss' ],
    output: './test'
  }
};


// Options
// -----------------------------------------------------------------------------

var options = {

  // SASS options.
  sass: {
    errLogToConsole: true,
    outputStyle: 'expanded',
    includePaths: []
  },

  // Autoprefixer options.
  autoprefixer: {
    browsers: [ 'ie >= 9' ]
  },

  // UglifyJS2 options.
  uglifyjs2: {
    ext: {
      min: '.min.js'
    },

    preserveComments: 'some'
  },

  // Rename options.
  rename: {
    css: {
      extname: '.min.css'
    },

    js: {
      extname: '.min.js'
    }
  },

  // Concat options.
  concat: {
    css: 'droppy.css',
    js: 'droppy.js'
  }
};


// Tasks
// -----------------------------------------------------------------------------

// Compile SCSS.
gulp.task( 'styles', function() {
  return gulp.src( path.styles.sass )
    .pipe( sass( options.sass ) ).on( 'error', sass.logError )
    .pipe( autoprefixer() )
    .pipe( gulp.dest( path.styles.output ) );
} );

// Minify CSS.
gulp.task( 'minify-css', function() {
  return gulp.src( path.styles.css )
    .pipe( concat( options.concat.css ) )
    .pipe( gulp.dest( path.dist ) )
    .pipe( cssnano() )
    .pipe( rename( options.rename.css ) )
    .pipe( gulp.dest( path.dist ) );
} );

// Minify JS.
gulp.task( 'minify-js', function() {
  return gulp.src( path.js )
    .pipe( concat( options.concat.js ) )
    .pipe( uglifyjs2( options.uglifyjs2 ) )
    .pipe( gulp.dest( path.dist ) );
} );

// Test files operations.
gulp.task( 'test', function() {
  return gulp.src( path.test.sass )
    .pipe( sass( options.sass ) ).on( 'error', sass.logError )
    .pipe( autoprefixer() )
    .pipe( gulp.dest( path.test.output ) );
} );

gulp.task( 'dist', [ 'test', 'styles', 'minify-css', 'minify-js' ] );

gulp.task( 'default', [ 'styles' ] );
