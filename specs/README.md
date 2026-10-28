# Test planning and specs

This directory is intended for the human-readable test plans that describe the scenarios covered by the automation suite. It complements the executable Playwright specs under `tests/specs/` and helps keep the project easier to understand and maintain.

## Purpose

Use this folder to document:

- the business flow or feature being tested
- the expected user actions and outcomes
- the test data or environment assumptions
- the related implementation files for the scenario

This makes it easier for QA, developers, and future maintainers to understand what each automation flow is meant to validate without reading the entire automation code.

## Project structure and responsibilities

```text
Rail_ERP_Automation/
├── tests/specs/                 # Executable Playwright scenarios
├── page-object/                 # Page objects with locators and actions
├── page-manager/                # Centralized page object creation
├── testcases/                   # Reusable end-to-end workflows
├── tests/test-data-management/  # JSON payloads and non-secret test inputs
├── specs/                       # Human-readable test plans and documentation
├── reporters/                   # Custom reporting
├── playwright.config.js         # Playwright test configuration
├── package.json                 # Project dependencies and scripts
└── README.md                    # Repository overview and setup guide
```

### What each layer does

- `tests/specs/`: contains the actual Playwright specs. These are the runnable test cases.
- `page-object/`: contains UI interaction wrappers for screens and components.
- `page-manager/`: creates and exposes the relevant page objects used by the test.
- `testcases/`: defines reusable workflows built from page-object methods.
- `tests/test-data-management/`: stores JSON data such as state codes, test names, or login-related values.
- `specs/`: holds planning documentation for the automated test coverage.

## Recommended test-plan format

Each plan should explain:

1. Feature or screen under test
2. Goal of the scenario
3. Preconditions and environment
4. Steps to perform
5. Expected result
6. Related files

Example:

```md
# Login flow

## Goal
Verify that a valid user can sign in and access the landing page.

## Preconditions
- Application is running
- Valid test user credentials are available
- Browser is configured for the target environment

## Steps
1. Open the login page
2. Enter valid credentials
3. Click the login button
4. Wait for the dashboard to load

## Expected results
- The user is redirected to the home page
- The dashboard is visible
- No validation error is shown

## Related files
- tests/specs/login/Login.spec.js
- page-object/menu-screen/login-page/
- tests/test-data-management/login/login.json
```

## How tests are organized

A typical scenario follows this pattern:

- test spec in `tests/specs/`
- page object in `page-object/`
- workflow in `testcases/` when logic is reused
- test data in `tests/test-data-management/`
- project plan in `specs/`

This structure keeps the suite readable and separates test behavior, UI interactions, and data.

## Creating a new test area

When adding a new feature such as `branch`, keep the same structure:

```text
tests/specs/branch/
    Branch.spec.js

testcases/branch-tc/
    BranchTc.js

page-object/menu-screen/branch-page/
    BranchPage.js

tests/test-data-management/branch/
    branch.json
```

Document the scenario here in `specs/` so the test intent is clear before someone looks at the automation code.

## Best practices

- Keep names descriptive and consistent with the feature name.
- Use a test plan to explain business intent, not just implementation details.
- Group reusable logic in `testcases/` and UI interactions in `page-object/`.
- Store non-secret test inputs in JSON under `tests/test-data-management/`.
- Keep documentation updated when a test flow changes.

This folder is a place for clarity and traceability across the automation suite.
