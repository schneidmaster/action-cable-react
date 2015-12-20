gulp    = require('gulp')
del     = require('del')
webpack = require('webpack-stream')
uglify  = require('gulp-uglify')
rename  = require('gulp-rename')

gulp.task 'clean', ->
  del(['dist/**/*'])

gulp.task 'webpackActionCable', ['clean'], ->
  gulp.src('lib/action_cable/action_cable.coffee')
    .pipe(webpack(require('./webpack.config.coffee')))
    .pipe(rename('action_cable.js'))
    .pipe(gulp.dest('dist'))

gulp.task 'webpackActionCableDist', ['webpackActionCable'], ->
  gulp.src('dist/action_cable.js')
    .pipe(uglify())
    .pipe(rename('action_cable.min.js'))
    .pipe(gulp.dest('dist'))

gulp.task 'webpackCable', ['clean'], ->
  gulp.src('lib/cable.coffee')
    .pipe(webpack(require('./webpack.config.coffee')))
    .pipe(rename('cable.js'))
    .pipe(gulp.dest('dist'))

gulp.task 'webpackCableDist', ['webpackCable'], ->
  gulp.src('dist/cable.js')
    .pipe(uglify())
    .pipe(rename('cable.min.js'))
    .pipe(gulp.dest('dist'))

gulp.task 'webpackCableMixin', ['clean'], ->
  gulp.src('lib/cable_mixin.coffee')
    .pipe(webpack(require('./webpack.config.coffee')))
    .pipe(rename('cable_mixin.js'))
    .pipe(gulp.dest('dist'))

gulp.task 'webpackCableMixinDist', ['webpackCableMixin'], ->
  gulp.src('dist/cable_mixin.js')
    .pipe(uglify())
    .pipe(rename('cable_mixin.min.js'))
    .pipe(gulp.dest('dist'))

gulp.task 'webpackChannelMixin', ['clean'], ->
  gulp.src('lib/channel_mixin.coffee')
    .pipe(webpack(require('./webpack.config.coffee')))
    .pipe(rename('channel_mixin.js'))
    .pipe(gulp.dest('dist'))

gulp.task 'webpackChannelMixinDist', ['webpackChannelMixin'], ->
  gulp.src('dist/channel_mixin.js')
    .pipe(uglify())
    .pipe(rename('channel_mixin.min.js'))
    .pipe(gulp.dest('dist'))

gulp.task 'bowerPack', ['webpackActionCable', 'webpackCable', 'webpackCableMixin', 'webpackChannelMixin'], ->
  gulp.src('bower.coffee')
    .pipe(webpack(require('./webpack.config.coffee')))
    .pipe(rename('action_cable_react.js'))
    .pipe(gulp.dest('dist'))

gulp.task 'bowerPackDist', ['bowerPack'], ->
  gulp.src('dist/action_cable_react.js')
    .pipe(uglify())
    .pipe(rename('action_cable_react.min.js'))
    .pipe(gulp.dest('dist'))

gulp.task 'default', [
  'webpackActionCable'
  'webpackCable'
  'webpackCableMixin'
  'webpackChannelMixin'
  'webpackActionCableDist'
  'webpackCableDist'
  'webpackCableMixinDist'
  'webpackChannelMixinDist'
  'bowerPack'
  'bowerPackDist'
]
