// Loads Angular's JIT compiler before any Angular modules are imported.
// This is required because Angular libraries use partial compilation and need
// the JIT compiler as a fallback when running in a Node/Playwright environment.
import '@angular/compiler';

export * from '@playwright/test';
