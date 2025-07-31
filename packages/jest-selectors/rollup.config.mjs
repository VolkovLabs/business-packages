import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import packageJson from './package.json' with { type: 'json' };

const name = packageJson.main.replace(/\.js$/, '');

export default [
  { input: `src/index.ts`, plugins: [esbuild()], output: [{ file: `${name}.js`, format: 'cjs', sourcemap: true }] },
  { input: `src/index.ts`, plugins: [dts()], output: { file: `${name}.d.ts`, format: 'es' } },
];
