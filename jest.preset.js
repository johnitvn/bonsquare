const nxPreset = require('@nx/jest/preset').default;
const { compilerOptions } = require('./tsconfig.base.json');
const { pathsToModuleNameMapper } = require('ts-jest');

module.exports = {
  ...nxPreset,
  collectCoverageFrom: ['src/**/*.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: process.cwd(),
    useESM: true
  })
};
