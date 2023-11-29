import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import inject from '@rollup/plugin-inject';
import packageJson from './package.json' assert { type: 'json' };

const name = packageJson.main.replace(/\.js$/, '');

export default [
  {
    input: `src/index.ts`,
    plugins: [
      commonjs(),
      nodeResolve({
        resolveOnly: [
          '@grafana/data',
          '@grafana/schema',
          'd3',
          'd3-color',
          'd3-force',
          'd3-interpolate',
          'd3-scale-chromatic',
          'ol',
          'react-colorful',
          'rxjs',
          'uuid',
        ],
      }),
      inject({
        window: 'global/window',
      }),
      esbuild(),
      terser(),
    ],
    output: [
      {
        file: `${name}.js`,
        format: 'cjs',
        sourcemap: true,
      },
    ],
  },
  {
    input: `src/index.ts`,
    plugins: [dts()],
    output: {
      file: `${name}.d.ts`,
      format: 'es',
    },
  },
];
