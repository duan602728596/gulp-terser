import through2 from 'through2';
import uglifyes from 'uglify-es';
import PluginError from 'plugin-error';

const PLUGIN_NAME: string = 'uglifyes';

function gulpUglifyes(option: Object = {}): Function{
  // 提示
  console.warn('Warn: Please use terser / gulp-terser instead of uglify-es / gulp-uglifyes.');

  const stream: Function = through2.obj(function(file: Object, enc: string, callback: Function): any{
    if(file.isStream()){
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    if(file.isBuffer()){
      try{
        const str: string = file.contents.toString('utf8');
        const result: Object = uglifyes.minify({
          'script': str
        }, option);

        file.contents = new Buffer(result.code);

        this.push(file);
        return callback();
      }catch(err){
        this.emit('error', new PluginError(PLUGIN_NAME, err));
        return callback();
      }
    }
  });

  return stream;
}

module.exports = gulpUglifyes;