// We set this specifically for 2 reasons.
// 1. It makes sense for both CI tests and local tests to behave the same so issues are found earlier
// 2. Any wrong timezone handling could be hidden if we use UTC/GMT local time (which would happen in CI).
process.env.TZ = 'Pacific/Easter'; // UTC-06:00 or UTC-05:00 depending on daylight savings

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
];

module.exports = {
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  modulePaths: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  testEnvironment: 'node',
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
