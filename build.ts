import { build } from 'vite';
import fs from 'fs';
import path from 'path';
import dep from './package.json';

const handlersDir = path.resolve(__dirname, 'src/handlers');
const outDir = path.resolve(__dirname, 'dist');

const entries = fs
  .readdirSync(handlersDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .flatMap(dir =>
    fs
      .readdirSync(path.join(handlersDir, dir.name))
      .filter(f => f.endsWith('.ts') && !f.endsWith('.d.ts') && !/\.(test|spec)\.ts$/.test(f))
      .map(f => ({
        fileName: f.replace(/\.ts$/, ''),
        parentDir: dir.name,
        entry: path.join(handlersDir, dir.name, f),
      }))
  );

const external = [
  ...Object.keys(dep.dependencies || {}),
  ...Object.keys(dep.devDependencies || {}),
];

const buildAll = async () => {
  fs.rmSync(outDir, { recursive: true, force: true });

  const promises = entries.map(entry =>
    build({
      configFile: false, // Possible removal necessary
      resolve: {
        alias: { '@common': path.resolve(__dirname, 'src/common') },
      },
      build: {
        outDir: path.join(outDir, entry.parentDir),
        emptyOutDir: false,
        target: 'esnext',
        minify: false,
        sourcemap: false,
        lib: { entry: entry.entry, formats: ['cjs'], fileName: () => `${entry.fileName}.js` },
        rollupOptions: { external },
      },
    })
  );

  await Promise.all(promises);
};

buildAll().catch(err => {
  console.error(err);
  process.exit(1);
});
