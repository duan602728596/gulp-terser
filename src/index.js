import through2 from 'through2';
import terser from 'terser';
import PluginError from 'plugin-error';
import applySourceMap from 'vinyl-sourcemaps-apply';

const PLUGIN_NAME: string = 'terser';

function gulpTerser(defaultOption: Object = {}): Function{
  // source-map option
  defaultOption.sourceMap = defaultOption?.sourceMap || {};

  const stream: Function = through2.obj(function(file: Object, enc: string, callback: Function): any{
    if(file.isStream()){
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return callback();
    }

    if(file.isBuffer()){
      try{
        // source-map option
        const option: Object = {
          ...defaultOption
        };

        if(file.sourceMap){
          option.sourceMap.filename = file.sourceMap.file;
        }

        const str: string = file.contents.toString('utf8');
        let build: Object | string = {};

        if('sourceMap' in file && 'file' in file.sourceMap){
          build[file.sourceMap.file] = str;
        }else{
          build = str;
        }

        const result: Object = terser.minify(build, option);

        file.contents = 'from' in Buffer ? Buffer.from(result.code) : new Buffer(result.code);

        // source-map
        if(file.sourceMap && result.map){
          applySourceMap(file, result.map);
        }

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

module.exports = gulpTerser;