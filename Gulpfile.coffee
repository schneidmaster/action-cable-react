gulp    = require('gulp')
del     = require('del')
coffee  = require('gulp-coffee')
uglify  = require('gulp-uglify')
rename  = require('gulp-rename')
webpack = require('webpack-stream')

gulp.task 'clean', ->
  del(['dist/**/*'])

gulp.task 'coffee', ['clean'], ->
  gulp.src('lib/**/*.coffee')
    .pipe(coffee(bare: true))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))

gulp.task 'bowerPack', ['clean'], ->
  gulp.src('bower.coffee')
    .pipe(webpack(require('./webpack.config.coffee')))
    .pipe(uglify())
    .pipe(rename('action_cable_react.js'))
    .pipe(gulp.dest('dist'))

gulp.task 'default', [
  'coffee'
  'bowerPack'
]

gulp.task 'watch', ->
  gulp.watch ['lib/**/*.coffee'], ['default']
