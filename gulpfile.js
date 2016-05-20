var gulp = require( 'gulp' ),
    uglifyjs2 = require( 'gulp-minify' ),
    sass = require( 'gulp-sass' ),
    autoprefixer = require( 'gulp-autoprefixer' ),
    cssnano = require( 'gulp-cssnano' ),
    rename = require( 'gulp-rename' );


// Path
// -----------------------------------------------------------------------------

var path = {

  // Distribution path.
  dist: './dist',

  // JavaScript path.
  js: './js/**/*.js',

  // Styles path.
  styles: {
    sass: './styles/scss/**/*.scss',
    css: './styles/css/**/*.css',
    output: './styles/css'
  },

  // Test path.
  test: {
    sass: './test/style.scss',
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
  autoprefixer: {},

  // UglifyJS2 options.
  uglifyjs2: {
    ext: {
      min: '.min.js'
    }
  },

  // Rename options.
  rename: {
    css: {
      extname: '.min.css'
    },

    js: {
      extname: '.min.js'
    }
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
    .pipe( cssnano() )
    .pipe( rename( options.rename.css ) )
    .pipe( gulp.dest( path.dist ) );
} );

// Minify JS.
gulp.task( 'minify-js', function() {
  return gulp.src( path.js )
    .pipe( uglifyjs2( options.uglifyjs2 ) )
    // .pipe( rename( options.rename.js ) )
    .pipe( gulp.dest( path.dist ) );
} );

// Compile test SCSS.
gulp.task( 'test-styles', function() {
  return gulp.src( path.test.sass )
    .pipe( sass( options.sass ) ).on( 'error', sass.logError )
    .pipe( autoprefixer() )
    .pipe( gulp.dest( path.test.output ) );
} );

gulp.task( 'dist', [ 'styles', 'minify-css', 'minify-js' ] );

gulp.task( 'default', [ 'styles' ] );
