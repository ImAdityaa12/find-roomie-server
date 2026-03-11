import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    server: 'src/server.ts'
  },
  format: ['esm'],
  outDir: 'dist',
  clean: true,
  dts: true,
  bundle: true,
  splitting: false,
  treeshake: true,
  minify: false,
});
