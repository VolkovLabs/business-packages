# Eslint Config

## Install

```
npm install --save-dev @volkovlabs/eslint-config
```

## Usage

Add to eslint config the following

```
{
    "extends": ["@volkovlabs/eslint-config"],
}
```

## Working in Monorepo
Eslint can't handle dependencies in monorepo. Need to install all package dependencies to make it working. 
