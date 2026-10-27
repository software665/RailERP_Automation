// @ts-check
import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';


export const appUrls = {
  baseURL: process.env.BASE_URL || 'http://192.168.11.25/RailERP-Staging/',
  loginURL: process.env.LOGIN_URL || './',
};

// Run headed locally by default; set HEADLESS=true in .env (Jenkins does this) for CI agents
const headless = process.env.HEADLESS === 'true';
/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],

    ['html', {
      outputFolder: 'playwright-report',
      open: 'never',
    }],

    ['allure-playwright'],

    ['./reporters/custom-reporter.js', {
      outputDir: 'custom-report',
    }],
  ],

  timeout: 60 * 1000,

  expect: {
    timeout: 10 * 1000,
  },
  
  use: {
     baseURL: appUrls.baseURL,
    browserName: 'chromium',
    headless: false,
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    viewport: null,

    launchOptions: {
      args: ['--start-maximized'],
    },
  },

  /* Configure projects for major browsers */
  projects: [
   {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        // A headless browser has no screen to maximize into, so give it a fixed desktop size
        viewport: headless ? { width: 1920, height: 1080 } : null,
        launchOptions: {
          args: headless ? [] : ['--start-maximized'],
        },
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
