import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';

/**
 * Shared Jest setup for the Angular libs (`setupFilesAfterEnv` -> each lib's `src/test-setup.ts`).
 *
 * - Sets up the zoneless Angular test environment.
 * - Shims DOM properties that browsers have and jsdom does not. Angular binds `[spellcheck]`, `[autocapitalize]` and
 *   `[autocomplete]` as properties, and reports NG0303 (unknown property) through `console.error` when the element
 *   has none.
 * - Fails any test that logs to `console.error`, so that a real error (an unknown binding, an error thrown in a
 *   lifecycle hook that Angular reports and swallows) cannot hide in the output. `console.error` is a Jest mock
 *   during a test: a test that expects an error can assert on it, then call `jest.mocked(console.error).mockClear()`.
 */
setupZonelessTestEnv();

function reflectProperty(
  proto: object,
  property: string,
  attribute: string,
  boolean: boolean
) {
  if (property in proto) return;
  Object.defineProperty(proto, property, {
    configurable: true,
    get(this: Element) {
      const value = this.getAttribute(attribute);
      return boolean ? value !== 'false' : value ?? '';
    },
    set(this: Element, value: unknown) {
      this.setAttribute(attribute, String(value));
    },
  });
}

reflectProperty(HTMLElement.prototype, 'spellcheck', 'spellcheck', true);
reflectProperty(
  HTMLElement.prototype,
  'autocapitalize',
  'autocapitalize',
  false
);
reflectProperty(
  HTMLFormElement.prototype,
  'autocomplete',
  'autocomplete',
  false
);

let consoleError: jest.SpyInstance;

beforeEach(() => {
  consoleError = jest
    .spyOn(console, 'error')
    .mockImplementation(() => undefined);
});

afterEach(() => {
  const calls = consoleError.mock.calls;
  consoleError.mockRestore();
  if (calls.length) {
    const messages = calls
      .map((args) =>
        args
          .map((arg) =>
            arg instanceof Error ? arg.stack ?? arg.message : String(arg)
          )
          .join(' ')
      )
      .join('\n---\n');
    throw new Error(
      `console.error was called ${calls.length} time(s) during the test. Fix the cause, or spy on and assert it in the test:\n${messages}`
    );
  }
});
