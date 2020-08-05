/* @flow */
import util from 'util';
import through2 from 'through2';
import terser from 'terser';
import PluginError from 'plugin-error';
import applySourceMap from 'vinyl-sourcemaps-apply';

const PLUGIN_NAME: string = 'terser';

type TerserResult = {
  code?: string,
  map?: string,
  error?: any
};

/* promise兼容 */
function isPromise(): boolean{
  if(util?.types?.isPromise){
    return util.types.isPromise;
  } else {
    return require('is-promise').default;
  }
}

/**
 * @param { Object } defaultOption: gulp传递的配置
 * @return { Function }
 */
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
        // terser option
        const option: Object = { ...defaultOption };

        if(file.sourceMap){
          option.sourceMap.filename = file.sourceMap.file;
        }

        // 配置需要兼容
        const str: string = file.contents.toString('utf8');
        let build: any /* string | Object */ = {};

        if('sourceMap' in file && 'file' in file.sourceMap){
          build[file.sourceMap.file] = str;
        }else{
          build = str;
        }

        // 压缩代码（terser5是异步，terser4是同步）
        const resultPromise: Promise<TerserResult> | TerserResult = terser.minify(build, option);

        // 编译函数
        const setContents: Function = (result: TerserResult): void=>{
          // 输出报错信息
          if('error' in result){
            throw new Error(result.error.message);
          }

          // Buffer
          file.contents = 'from' in Buffer ? Buffer.from(result.code) : new Buffer(result.code);

          // 输出source-map
          if(file.sourceMap && result.map){
            applySourceMap(file, result.map);
          }

          this.push(file);
        };

        if(isPromise(resultPromise)){
          return resultPromise.then((result: TerserResult): void=>{
            setContents(result);

            return Promise.resolve(callback());
          });
        } else {
          setContents(resultPromise);

          return callback();
        }
      }catch(err){
        this.emit('error', new PluginError(PLUGIN_NAME, err));
        return callback();
      }
    }
  });

  return stream;
}

module.exports = gulpTerser;