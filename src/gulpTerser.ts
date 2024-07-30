import type { Transform } from 'stream';
import { obj, type TransformCallback } from 'through2';
import { minify, type MinifyOptions, type MinifyOutput } from 'terser';
import * as PluginError from 'plugin-error';
import * as applySourceMap from 'vinyl-sourcemaps-apply';

const PLUGIN_NAME: string = 'terser';

/**
 * @param { MinifyOptions } gulpTerserOptions - gulp-terser configuration
 * @param { typeof minify | undefined } minifyCompiler - custom minify function
 */
function gulpTerser(gulpTerserOptions: MinifyOptions = {}, minifyCompiler: typeof minify | undefined): Transform {
  const terserMinifyCompiler: typeof minify = minifyCompiler ?? minify;

  return obj(async function(chunk: any, enc: BufferEncoding, callback: TransformCallback): Promise<void> {
    if (chunk.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));

      return callback();
    }

    if (chunk.isBuffer()) {
      try {
        const terserOptions: MinifyOptions = Object.assign({}, gulpTerserOptions);

        // SourceMap configuration
        if (chunk.sourceMap) {
          if (!terserOptions.sourceMap || terserOptions.sourceMap === true) {
            terserOptions.sourceMap = {};
          }

          terserOptions.sourceMap.filename = chunk.sourceMap.file;
        }

        const chunkString: string = chunk.contents.toString('utf8');
        let build: string | string[] | Record<string, string> = {};

        // gulp version compatibility
        if (('sourceMap' in chunk) && ('file' in chunk.sourceMap)) {
          build[chunk.sourceMap.file] = chunkString;
        } else {
          build = chunkString;
        }

        // Compressed code (terser5 is asynchronous, terser4 is synchronous)
        const minifyOutput: MinifyOutput = await terserMinifyCompiler(build, terserOptions);

        // Buffer
        if (minifyOutput.code) {
          chunk.contents = Buffer.from(minifyOutput.code);
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