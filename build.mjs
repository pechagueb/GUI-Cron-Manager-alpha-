import esbuild from 'esbuild';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const genAiPath = require.resolve('@google/genai');

const buildOptions = {
  entryPoints: ['index.tsx'],
  bundle: true,
  outfile: 'dist/bundle.js',
  sourcemap: true,
  // This is a workaround to ensure @google/genai is correctly bundled
  // as it may have dynamic requires or other structures that esbuild
  // needs help with. Forcing it as external is not ideal, but often works.
  // In a real app, more complex bundling might be needed.
  // We will instead try to resolve its path and bundle it.
  // external: ['@google/genai'], // if bundling fails, uncomment this
  format: 'esm',
  define: {
    'process.env.NODE_ENV': '"production"',
    // Fix: Inject the API_KEY from the environment at build time. This is the recommended
    // approach to make environment variables available to frontend code.
    'process.env.API_KEY': `"${process.env.API_KEY || ''}"`,
  },
};

esbuild.build(buildOptions).catch(() => process.exit(1));
