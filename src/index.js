import through2 from 'through2';
import terser from 'terser';
import PluginError from 'plugin-error';
import applySourceMap from 'vinyl-sourcemaps-apply';

const PLUGIN_NAME: string = 'terser';

function gulpTerser(option: Object = {}): Function{
  const stream: Function = through2.obj(function(file: Object, enc: string, callback: Function): any{
    if(file.isStream()){
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return callback();
    }

    if(file.isBuffer()){
      try{
        // source-map option
        if(file.sourceMap){}

        const str: string = file.contents.toString('utf8');
        const result: Object = terser.minify(str, option);

        file.contents = new Buffer(result.code);

        // source-map
        if(result.map && file.sourceMap){
          applySourceMap(file, result.map);
        }

        return callback(null, file);
      }catch(err){
        this.emit('error', new PluginError(PLUGIN_NAME, err));
        return callback();
      }
    }
  });

  return stream;
}

module.exports = gulpTerser;