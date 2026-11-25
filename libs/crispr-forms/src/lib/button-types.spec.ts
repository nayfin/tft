import { readdirSync, readFileSync } from 'fs';
import { join, relative } from 'path';

/**
 * A `<button>` without a `type` is a submit button, so inside a `<crispr-form>` clicking it submits the form.
 * Every button in the library has to say what it is.
 */
const MESSAGE =
  'add type="button" (or type="submit" when it is meant to submit) to each of these buttons';

/** The `file:line` places in `source` where a `<button>` has no `type`, `[type]` or `[attr.type]`. */
export function findUntypedButtons(source: string): number[] {
  const lines: number[] = [];
  for (const match of source.matchAll(/<button\b[^>]*?>/gs)) {
    if (!/\s(?:type|\[type\]|\[attr\.type\])\s*=/.test(match[0])) {
      lines.push(source.slice(0, match.index).split('\n').length);
    }
  }
  return lines;
}

/** All the files under `directory` that can hold a template: `.html` and non-spec `.ts` files (inline templates). */
function templateFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return templateFiles(path);
    }
    return /\.html$/.test(entry.name) ||
      (/\.ts$/.test(entry.name) && !/\.spec\.ts$/.test(entry.name))
      ? [path]
      : [];
  });
}

describe('findUntypedButtons', () => {
  it('finds a button without a type', () => {
    expect(findUntypedButtons('<button mat-button>Save</button>')).toEqual([1]);
  });

  it('accepts a button with a type', () => {
    expect(
      findUntypedButtons(
        '<button type="button">A</button><button type="submit">B</button>'
      )
    ).toEqual([]);
  });

  it('finds a button whose tag spans several lines, at the line it starts on', () => {
    const source =
      '<div>\n  <button\n    mat-button\n    (click)="go()">\n    Go\n  </button>\n</div>';

    expect(findUntypedButtons(source)).toEqual([2]);
  });

  it('accepts a multi-line button with a type', () => {
    expect(
      findUntypedButtons('<button\n  mat-button\n  type="button"\n>Go</button>')
    ).toEqual([]);
  });

  it('accepts a bound type', () => {
    expect(
      findUntypedButtons(
        '<button [type]="kind">A</button><button [attr.type]="kind">B</button>'
      )
    ).toEqual([]);
  });

  it('does not take other attributes that end in "type" for a type', () => {
    expect(
      findUntypedButtons('<button buttonType="raised">A</button>')
    ).toEqual([1]);
  });

  it('reports every untyped button with its line', () => {
    expect(
      findUntypedButtons(
        '<button>A</button>\n<button type="button">B</button>\n<button>C</button>'
      )
    ).toEqual([1, 3]);
  });
});

describe('the buttons in the library', () => {
  it('all have an explicit type', () => {
    const libSource = join(__dirname, '..');
    const untyped = templateFiles(libSource).flatMap((file) =>
      findUntypedButtons(readFileSync(file, 'utf8')).map(
        (line) => `${relative(libSource, file).replace(/\\/g, '/')}:${line}`
      )
    );

    expect({ message: MESSAGE, untyped }).toEqual({
      message: MESSAGE,
      untyped: [],
    });
  });
});
