/* eslint-disable */
export default {
  displayName: 'web-api-gateway-interfaces',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }]
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/components/microservice-gateways/web-api-gateway-interfaces'
};
