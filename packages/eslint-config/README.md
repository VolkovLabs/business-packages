# ESLint Configuration

## Install

```
npm install --save-dev @volkovlabs/eslint-config
```

## Usage

Add to ESLint config the following

```
import eslintConfig from '@volkovlabs/eslint-config';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  eslintConfig,
]);
```

## Working in Monorepo

ESLint can't handle dependencies in a mono repo. Install all package dependencies to make it work.

## License

Apache License Version 2.0.
