import type { Transform } from 'stream';
import { obj, TransformCallback } from 'through2';
import { minify, type MinifyOptions, type MinifyOutput } from 'terser';
import PluginError from 'plugin-error';
import applySourceMap from 'vinyl-sourcemaps-apply';

const PLUGIN_NAME: string = 'terser';

interface TerserOptionsArg {
  base: string;
  relative: string;
  dirname: string;
  basename: string;
  extname: string;
  chunk: any;
}

interface MinifyOptionsFunc {
  (arg: TerserOptionsArg): MinifyOptions | Promise<MinifyOptions>;
}

interface GulpTerserOptions {
  terserOptions?: MinifyOptions | MinifyOptionsFunc;
}

/**
 * terser options
 * @param { any } chunk
 * @param { MinifyOptions | MinifyOptionsFunc | undefined } terserOptions
 */
async function getTerserOptions(chunk: any, terserOptions?: MinifyOptions | MinifyOptionsFunc): Promise<MinifyOptions> {
  let terserMinifyOptions: MinifyOptions = {};

  if (typeof terserOptions === 'function') {
    terserMinifyOptions = await terserOptions({
      base: chunk.base,
      relative: chunk.relative,
      dirname: chunk.dirname,
      basename: chunk.basename,
      extname: chunk.extname,
      chunk
    });
  } else if (terserOptions === 'object') {
    terserMinifyOptions = terserOptions;
  }

  return terserMinifyOptions;
}

/**
 * @param { GulpTerserOptions } gulpTerserOptions: gulp-terser configuration
 * @param { typeof minify | undefined } customMinifyFunc：custom minify function
 */
function gulpTerser(gulpTerserOptions: GulpTerserOptions = {}, customMinifyFunc: typeof minify | undefined): Transform {
  const minifyFunc: typeof minify = customMinifyFunc ?? minify;

  return obj(async function(chunk: any, enc: BufferEncoding, callback: TransformCallback): Promise<void> {
    if (chunk.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));

      return callback();
    }

    if (chunk.isBuffer()) {
      try {

        const terserOptions: MinifyOptions = await getTerserOptions(chunk, gulpTerserOptions.terserOptions);

        // SourceMap configuration
        if (chunk.sourceMap && (!terserOptions.sourceMap || terserOptions.sourceMap === true)) {
          terserOptions.sourceMap = {
            filename: chunk.sourceMap.file
          };
        }

        const chunkString: string = chunk.contents.toString('utf8');
        const build: string | string[] | { [file: string]: string } = chunk?.sourceMap?.file
          ? { [chunk.sourceMap.file]: chunkString }
          : chunkString;

        // Compressed code (terser5 is asynchronous, terser4 is synchronous)
        const minifyOutput: MinifyOutput = await minifyFunc(build, terserOptions);

        if ('error' in minifyOutput) {
          throw new Error(minifyOutput['error']['message']);
        }

        // Buffer
        if (minifyOutput.code) {
          chunk.contents = ('from' in Buffer) ? Buffer.from(minifyOutput.code) : new Buffer(minifyOutput.code);
        }

        // Output source-map
        if (chunk.sourceMap && minifyOutput.map) {
          applySourceMap(chunk, minifyOutput.map);
        }

        this.push(chunk);

        return callback();
      } catch (err) {
        this.emit('error', new PluginError(PLUGIN_NAME, err));

        return callback();
      }
    }
  });
}

export default gulpTerser;