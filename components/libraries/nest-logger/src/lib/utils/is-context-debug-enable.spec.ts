import { isContextDebugEnable } from './is-context-debug-enable';

describe('isContextDebugEnable', () => {
  test('Should return true if context is includesd and not excludesd', () => {
    const includes = ['User*', 'Auth*'];
    const excludes = ['AdminController'];
    expect(isContextDebugEnable('UserController', includes, excludes)).toBe(true);
    expect(isContextDebugEnable('AuthService', includes, excludes)).toBe(true);
  });

  test('Should return false if context is excludesd', () => {
    const includes: string[] = [];
    const excludes = ['UserController', 'AuthService'];
    expect(isContextDebugEnable('UserController', includes, excludes)).toBe(false);
    expect(isContextDebugEnable('AuthService', includes, excludes)).toBe(false);
  });

  test('Should return true if includes contains *', () => {
    const includes = ['*'];
    const excludes: string[] = [];
    expect(isContextDebugEnable('UserController', includes, excludes)).toBe(true);
    expect(isContextDebugEnable('AuthService', includes, excludes)).toBe(true);
  });

  test('Should return false if includes and excludes empty', () => {
    const includes = [];
    const excludes: string[] = [];
    expect(isContextDebugEnable('UserController', includes, excludes)).toBe(false);
    expect(isContextDebugEnable('AuthService', includes, excludes)).toBe(false);
  });

  test('Should return false if context does not match any includes pattern', () => {
    const includes = ['User*', 'Auth*'];
    const excludes: string[] = [];
    expect(isContextDebugEnable('AdminController', includes, excludes)).toBe(false);
    expect(isContextDebugEnable('MailingService', includes, excludes)).toBe(false);
  });

  test('Should return true if context matches any includes pattern', () => {
    const includes = ['User*', 'Auth*'];
    const excludes: string[] = [];
    expect(isContextDebugEnable('UserController', includes, excludes)).toBe(true);
    expect(isContextDebugEnable('AuthService', includes, excludes)).toBe(true);
  });
});
