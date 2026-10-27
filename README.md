# Rail ERP Playwright Automation

This repository contains UI automation for Rail ERP using Playwright Test. Tests are organized into spec files, reusable page objects, test-case workflows, and JSON test data.

## Prerequisites

- Node.js (LTS recommended) and npm
- Git, if cloning the repository
- Access to a Rail ERP environment and valid test credentials
- Java installed if using the Allure command-line report generator

Check Node.js and npm:

```powershell
node --version
npm --version
```

## Install and run this project

From the project root:

```powershell
npm ci
npx playwright install chromium
```

`npm ci` installs the versions recorded in `package-lock.json`. The current Playwright configuration runs Chromium by default. To install browsers for all configured projects instead, run:

```powershell
npx playwright install
```

Run the tests:

```powershell
npx playwright test
```

Run one spec or one project:

```powershell
npx playwright test tests/specs/login/Login.spec.js
npx playwright test --project=chromium
```

Open the Playwright HTML report after a run:

```powershell
npx playwright show-report
```

## Starting a new Playwright project

For a new project (not this already-initialized repository), create a directory, move into it, and run the Playwright project initializer:

```powershell
mkdir MyPlaywrightProject
cd MyPlaywrightProject
npm init playwright@latest
```

Follow the prompts to choose JavaScript or TypeScript, the test directory, and whether to install browsers. The initializer creates a starter configuration and tests. In this repository, use the existing files and install its dependencies with `npm ci`; do not run the initializer over the existing project.

## Project structure

```text
Rail_ERP_Automation/
├── .github/workflows/          # GitHub Actions workflow configuration
├── page-manager/
│   └── Page-Manager.js         # Creates and exposes page-object instances
├── page-object/
│   ├── menu-screen/            # Page objects for application screens
│   └── navigate-screen/        # Navigation page object
├── reporters/
│   └── custom-reporter.js      # Custom Playwright reporter
├── specs/
│   └── README.md               # Test-plan documentation
├── testcases/
│   └── state-tc/               # Reusable State workflow, e.g. StateTc.js
├── tests/
│   ├── specs/                  # Playwright test spec files
│   │   ├── login/
│   │   └── state/
│   └── test-data-management/   # JSON data used by test specs/workflows
│       ├── login/
│       └── state/
├── playwright.config.js        # Test discovery, browsers, URLs, and reporters
├── package.json                # Dependencies and npm project metadata
└── package-lock.json           # Locked dependency versions
```

### What belongs in each folder?

- **`tests/specs/`**: Playwright tests. Each spec describes the scenario, sets up the browser/page, invokes the workflow, and makes assertions.
- **`page-object/`**: Page objects encapsulate locators and actions for individual screens, such as login and state management.
- **`page-manager/`**: Provides a central entry point to construct the page objects for a page.
- **`testcases/`**: Reusable end-to-end workflows composed from page-object actions. For example, `StateTc.js` provides the state-creation workflow.
- **`tests/test-data-management/`**: JSON data such as test names, state codes, and credentials. Keep secrets out of committed test data.
- **`reporters/`**: Custom reporting integration.
- **`specs/`**: Test plans and their documentation; executable test specs live in `tests/specs/`.

## Add a test folder and test files

Create folders under the existing `tests` layout. For example, in PowerShell:

```powershell
New-Item -ItemType Directory -Force tests/specs/branch
New-Item -ItemType Directory -Force tests/test-data-management/branch
New-Item -ItemType Directory -Force testcases/branch-tc
New-Item -ItemType Directory -Force page-object/menu-screen/branch-page
```

Add the related files:

1. Put the Playwright scenario in `tests/specs/branch/Branch.spec.js`.
2. Put reusable screen interactions in a page object under `page-object/`.
3. If the scenario is a reusable workflow, add it under `testcases/branch-tc/`.
4. Put non-secret input values in `tests/test-data-management/branch/branch.json`.
5. Import modules and JSON with relative paths from the importing file. For example, from `tests/specs/branch/Branch.spec.js`:

   ```js
   import branchData from '../../test-data-management/branch/branch.json';
   ```

Use descriptive test names and follow the existing page-object and testcase patterns.

## Configure the target environment

The Playwright configuration reads `BASE_URL`, `LOGIN_URL`, and `HEADLESS`. Create a local `.env` file in the project root (it is ignored by Git):

```dotenv
BASE_URL=https://your-railerp-environment.example/
LOGIN_URL=./
HEADLESS=true
```

The project already includes `dotenv`. For a new project, install it with:

```powershell
npm install dotenv
```

`playwright.config.js` loads `.env` through `dotenv/config`. The configuration has a default `BASE_URL`, but use the URL and credentials for the environment you are authorized to test. Do not commit credentials or secrets; use your CI secret store for pipelines.

For a visible local Chromium browser, set `HEADLESS=false` or omit it. In CI, set `HEADLESS=true`.

## Playwright reports

The configuration enables the list reporter, Playwright HTML reporter, Allure Playwright reporter, and the custom reporter. Test runs write report output to:

- `playwright-report/` — Playwright HTML report
- `custom-report/` — custom HTML report
- `allure-results/` — raw Allure result files

These generated folders are ignored by Git.

### Allure

The project already includes `allure-playwright` as a development dependency. It is the Playwright adapter that writes Allure results. Install it in a new project with:

```powershell
npm install --save-dev allure-playwright
```

Do not install it twice using both `--save-dev` and `-D`; they are equivalent npm flags.

To generate and open a report, install the Allure command-line tool (requires Java):

```powershell
npm install -g allure-commandline
allure generate allure-results --clean -o allure-report
allure open allure-report
```

Alternatively, if the CLI is already installed, you can serve the results directly:

```powershell
allure serve allure-results
```

## Playwright test agents

Playwright can create agent instruction files for test planning, generation, and healing:

```powershell
npx playwright init-agents --loop=vscode
```

See the [Playwright test agents guide](https://playwright.dev/docs/test-agents) for details.

## Accessibility testing with axe

The project includes `@axe-core/playwright`. Install it in a new project with:

```powershell
npm install -D @axe-core/playwright
```

Example accessibility check in a Playwright spec:

```js
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('page has no detected accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

Automated axe checks are useful, but they do not replace manual accessibility testing.

## Useful references

- [Playwright documentation](https://playwright.dev/docs/intro)
- [Playwright test agents](https://playwright.dev/docs/test-agents)
- [Allure Playwright documentation](https://allurereport.org/docs/playwright/)
- [axe-core Playwright documentation](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)
