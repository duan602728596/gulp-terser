import type { Transform } from 'stream';
import { obj, TransformCallback } from 'through2';
import { minify, MinifyOptions, MinifyOutput } from 'terser';
import * as PluginError from 'plugin-error';
import * as applySourceMap from 'vinyl-sourcemaps-apply';

const PLUGIN_NAME: string = 'terser';

/**
 * @param { MinifyOptions } gulpTerserOptions: gulp-terser configuration
 * @param { typeof minify | undefined } customMinifyFunc：custom minify function
 */
function gulpTerser(gulpTerserOptions: MinifyOptions = {}, customMinifyFunc: typeof minify | undefined): Transform {
  const minifyFunc: typeof minify = customMinifyFunc ?? minify;

  return obj(async function(chunk: any, enc: BufferEncoding, callback: TransformCallback): Promise<void> {
    if (chunk.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));

      return callback();
    }

    if (chunk.isBuffer()) {
      try {
        const terserOptions: MinifyOptions = { ...gulpTerserOptions };

        // SourceMap configuration
        if (chunk.sourceMap) {
          if (!terserOptions.sourceMap || terserOptions.sourceMap === true) {
            terserOptions.sourceMap = {};
          }

          terserOptions.sourceMap.filename = chunk.sourceMap.file;
        }

        const chunkString: string = chunk.contents.toString('utf8');
        let build: string | string[] | { [file: string]: string } = {};

        // gulp version compatibility
        if (('sourceMap' in chunk) && ('file' in chunk.sourceMap)) {
          build[chunk.sourceMap.file] = chunkString;
        } else {
          build = chunkString;
        }

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