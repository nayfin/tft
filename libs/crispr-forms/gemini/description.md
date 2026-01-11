# crispr-forms Architecture

This document provides a concise overview of the `crispr-forms` library architecture for quick context.

## Core Purpose

`crispr-forms` is an Angular library for dynamically generating forms from a configuration object. It is built on top of Angular Material.

## Key Architectural Components

- **`<crispr-form>` component:**
    - Location: `libs/crispr-forms/src/lib/form/form.component.ts`
    - Purpose: The main entry point of the library. It takes a `FormConfig` object as input and renders the form.

- **Field Components:**
    - Location: `libs/crispr-forms/src/lib/ui/`
    - Purpose: Individual Angular components that represent different form field types (e.g., input, select, datepicker). Each field has its own directory.

- **Configuration System:**
    - **`FormConfig`:** The main configuration object for the entire form.
    - **`FieldConfig`:** A base interface for all field configurations.
    - **`ControlType`:** An enum that maps to the different field types.
    - Location of configuration interfaces: `libs/crispr-forms/src/lib/utils/models/`

- **Dynamic Field Generation:**
    - **`field.directive.ts`:** A directive used to host the dynamically created form fields.
    - **`field-component-map.const.ts`:** A map that links a `ControlType` to a specific field component.

## How to find things

- The main module is `libs/crispr-forms/src/lib/crispr-forms.module.ts`.
- The public API is defined in `libs/crispr-forms/src/lib/public_api.ts`.
- All field components are in `libs/crispr-forms/src/lib/ui/`.
- All field configuration interfaces are in `libs/crispr-forms/src/lib/utils/models/`.
