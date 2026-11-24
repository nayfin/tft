/**
 * Options for the snack bar a form opens, when `FormConfig.showInvalidErrors` is on,
 * to list what is wrong after the user submits an invalid form.
 */
export interface InvalidErrorsConfig {
  /**
   * How long the snack bar stays open, in milliseconds. 0 keeps it open until the user dismisses it.
   * @default 8000
   */
  duration?: number;
  /**
   * The most errors to list. The rest are summed up as "+N more".
   * @default 5
   */
  maxErrors?: number;
  /**
   * The text of the button that closes the snack bar.
   * @default 'Dismiss'
   */
  dismissLabel?: string;
}
