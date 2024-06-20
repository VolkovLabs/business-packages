import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import inject from '@rollup/plugin-inject';

const getOutputPath = (file) => `dist/${file}`;

export default [
  {
    input: `src/server.ts`,
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
        file: getOutputPath('server.js'),
        format: 'cjs',
        sourcemap: true,
      },
    ],
  },
  {
    input: 'src/client.ts',
    plugins: [esbuild(), terser()],
    output: [
      {
        file: getOutputPath('client.js'),
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: getOutputPath('esm/client.js'),
        format: 'esm',
        sourcemap: true,
      },
    ],
    external: [
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
  },
  {
    input: 'src/client.ts',
    plugins: [dts()],
    output: {
      file: getOutputPath('client.d.ts'),
      format: 'es',
    },
  },
  {
    input: 'src/server.ts',
    plugins: [dts()],
    output: {
      file: getOutputPath('server.d.ts'),
      format: 'es',
    },
  },
];
