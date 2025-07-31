/**
 * Node Modules To Transform
 * @param moduleNames
 * @returns {`node_modules\/(?!.*(${*})\/.*)`}
 */
const nodeModulesToTransform = (moduleNames) => `node_modules\/(?!.*(${moduleNames.join('|')})\/.*)`;

/**
 * Array of known nested grafana package dependencies that only bundle an ESM version
 */
const grafanaESModules = [
  '.pnpm', // Support using pnpm symlinked packages
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
  'marked',
  'react-calendar',
  'get-user-locale',
  'memoize',
  'mimic-function',
  '@wojtekmaj',
];

module.exports = {
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    'rc-slider': '<rootDir>/src/__tests__/__mocks__/rc-slider.tsx',
  },
  modulePaths: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test,jest}.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test,jest}.{js,jsx,ts,tsx}',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        sourceMaps: 'inline',
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: false,
            dynamicImport: true,
          },
        },
      },
    ],
  },
  /**
   * Jest will throw `Cannot use import statement outside module` if it tries to load an
   * ES module without it being transformed first. ./config/README.md#esm-errors-with-jest
   */
  transformIgnorePatterns: [nodeModulesToTransform(grafanaESModules)],
};
