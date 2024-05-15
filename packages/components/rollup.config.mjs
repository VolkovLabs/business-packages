import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import terser from '@rollup/plugin-terser';
import packageJson from './package.json' assert { type: 'json' };

const name = packageJson.main.replace(/\.js$/, '');

export default [
  {
    input: `src/index.ts`,
    plugins: [esbuild(), terser()],
    output: [
      {
        file: `${name}.js`,
        format: 'cjs',
        sourcemap: true,
      },
    ],
    external: ['react', '@grafana/ui', '@grafana/data', 'rc-slider', '@emotion/css', '@emotion/react', 'rc-tooltip'],
  },
  {
    input: `src/index.ts`,
    plugins: [dts()],
    output: {
      file: `${name}.d.ts`,
      format: 'es',
    },
    external: ['react', '@grafana/ui', '@grafana/data', 'rc-slider', '@emotion/css', '@emotion/react', 'rc-tooltip'],
  },
];
