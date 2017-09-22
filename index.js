var through = require('through2');
var gutil = require('gulp-util');
var uglify = require('uglify-es');

var PluginError = gutil.PluginError;
var PLUGIN_NAME = 'gulp-uglifyes';

function gulpUglifyes(option){

  var stream = through.obj(function(file, enc, cb){
    if(file.isStream()){
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }
    if(file.isBuffer()){
      try{
        var str = file.contents.toString('utf8');
        var result = uglify.minify({
          'script': str
        }, option);

        file.contents = new Buffer(result.code);
        return cb(null, file);
      }catch(err){
        this.emit('error', new PluginError(PLUGIN_NAME, err));
        return cb();
      }
    }
  });

  return stream;
}

module.exports = gulpUglifyes;