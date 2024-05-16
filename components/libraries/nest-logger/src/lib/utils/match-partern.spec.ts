import { matchPattern } from './match-partern';

describe('matchPattern', () => {
  test('Pattern "*" should match any context', () => {
    expect(matchPattern('UserController', '*')).toBe(true);
    expect(matchPattern('AuthService', '*')).toBe(true);
    expect(matchPattern('AdminDashboard', '*')).toBe(true);
  });

  test('Exact match pattern should match only the exact context', () => {
    expect(matchPattern('UserController', 'UserController')).toBe(true);
    expect(matchPattern('AuthService', 'AuthService')).toBe(true);
    expect(matchPattern('UserController', 'AuthService')).toBe(false);
  });

  test('Pattern without wildcard should match only exact context', () => {
    expect(matchPattern('UserController', 'User')).toBe(false);
    expect(matchPattern('AuthService', 'Service')).toBe(false);
    expect(matchPattern('UserController', 'UserController')).toBe(true);
  });

  test('Pattern with wildcard should match context with corresponding parts', () => {
    expect(matchPattern('', '*')).toBe(true);
    expect(matchPattern('AuthService', '*')).toBe(true);
    expect(matchPattern('UserController', 'User*Controller')).toBe(true);
    expect(matchPattern('AdminController', 'User*Controller')).toBe(false);
    expect(matchPattern('UserController', '*Controller')).toBe(true);
    expect(matchPattern('AuthService', 'Auth*')).toBe(true);
    expect(matchPattern('AuthService', '*Service')).toBe(true);
    expect(matchPattern('UserService', 'Auth*')).toBe(false);
    expect(matchPattern('UserAuthController', 'User*Controller')).toBe(true);
    expect(matchPattern('AuthServiceController', '*Service')).toBe(false);
    expect(matchPattern('AuthServiceController', '*Service*')).toBe(true);
  });
});
