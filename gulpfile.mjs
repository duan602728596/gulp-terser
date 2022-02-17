import path from 'node:path';
import fs from 'node:fs';
import gulp from 'gulp';
import gulpTypescript from 'gulp-typescript';
import { ProjectCompiler as GulpTypescriptProjectCompiler } from 'gulp-typescript/release/compiler.js';
import gulpTypescriptUtils from 'gulp-typescript/release/utils.js';
import rename from 'gulp-rename';
import typescript from 'typescript';
import tsconfig from './tsconfig.json' assert { type: 'json' };

/**
 * fix: Override the attachContentToFile method of ProjectCompiler
 *      Compilation for supporting mts and cts files
 */
GulpTypescriptProjectCompiler.prototype.attachContentToFile = function(file, fileName, content) {
  const [, extension] = gulpTypescriptUtils.splitExtension(fileName, ['d.ts', 'd.ts.map']);

  switch (extension) {
    case 'js':
    case 'jsx':
    case 'mjs':
    case 'cjs':
      file.jsFileName = fileName;
      file.jsContent = content;
      break;

    case 'd.ts.map':
      file.dtsMapFileName = fileName;
      file.dtsMapContent = content;
      break;

    case 'd.ts':
      file.dtsFileName = fileName;
      file.dtsContent = content;
      break;

    case 'map':
      file.jsMapContent = content;
      break;
  }
};

/* rename */
function renameCallback(p) {
  if (p.extname === '.mjs' || p.extname === '.cjs') {
    p.extname = '.js';
  }
}

const tsBuildConfig = {
  ...tsconfig.compilerOptions,
  moduleResolution: 'Node12',
  module: 'Node12',
  typescript
};

const tsESMBuildConfig = {
  ...tsconfig.compilerOptions,
  module: 'ESNext',
  typescript
};

function createProject(out, cfg) {
  const isEsm = out === 'esm';
  const src = path.join(isEsm ? 'src/**/*.{ts,mts}' : 'src/**/*.{ts,cts}');

  return function() {
    const result = gulp.src(src)
      .pipe(gulpTypescript(cfg));

    if (isEsm) {
      return result.js
        .pipe(rename(renameCallback))
        .pipe(gulp.dest(out));
    } else {
      return result.js
        .pipe(rename(renameCallback))
        .pipe(gulp.dest(out));
    }
  };
}

/* 写入package.js文件 */
async function writeTypeModulePackageJsonFile() {
  await fs.promises.writeFile(
    'esm/package.json',
    JSON.stringify({ type: 'module' }, null, 2) + '\n'
  );
}

export default gulp.series(
  gulp.parallel(
    createProject('lib', tsBuildConfig),
    createProject('esm', tsESMBuildConfig)
  ),
  writeTypeModulePackageJsonFile
);