
/**
 * RailERP_Automation - Playwright CI/CD Pipeline
 *
 * Run:
 * node rail-erp-pipeline.js
 */

const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const config = {
  PROJECT_NAME: "RailERP_Automation",

  BASE_URL: (
    process.env.BASE_URL ||
    "https://YOUR-RAILERP-APPLICATION-URL"
  ).replace(/\/+$/, ""),

  LOGIN_URL: process.env.LOGIN_URL || "/login",

  TEST_TAG: process.env.TEST_TAG || "",

  TEST_PATH: process.env.TEST_PATH || "",

  HEADLESS: process.env.HEADLESS || "true",

  CI: "true",
};

function runCommand(command, args = [], allowFailure = false) {
  console.log(`\n> ${command} ${args.join(" ")}`);

  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, CI: "true" },
    timeout: 60 * 60 * 1000,
  });

  if (result.error) {
    console.error(result.error.message);

    if (!allowFailure) {
      throw result.error;
    }

    return 1;
  }

  const status = result.status ?? 1;

  if (status !== 0 && !allowFailure) {
    throw new Error(`${command} exited with code ${status}`);
  }

  return status;
}

// Stage 1: Install Dependencies
function installDependencies() {
  console.log("\nStage 1: Install Dependencies");

  runCommand("node", ["-v"]);
  runCommand("npm", ["ci"]);
  runCommand("npx", ["playwright", "install", "chromium"]);
}

// Stage 2: Write Environment Configuration
function writeEnv() {
  console.log("\nStage 2: Write .env");

  const content = [
    `BASE_URL=${config.BASE_URL}`,
    `LOGIN_URL=${config.LOGIN_URL}`,
    `HEADLESS=${config.HEADLESS}`,
    "",
  ].join("\n");

  fs.writeFileSync(".env", content);

  console.log(
    `RailERP URL: ${config.BASE_URL}${config.LOGIN_URL}`
  );
}

// Stage 3: Clean Old Reports
function cleanOldResults() {
  console.log("\nStage 3: Clean Old Results");

  const folders = [
    "allure-results",
    "playwright-report",
    "custom-report",
    "test-results",
  ];

  folders.forEach((folder) => {
    fs.rmSync(path.resolve(folder), {
      recursive: true,
      force: true,
    });
  });
}

// Stage 4: Execute Playwright Tests
function runTests() {
  console.log("\nStage 4: Run RailERP Playwright Tests");

  const args = [
    "playwright",
    "test",
    "--project=chromium",
  ];

  if (config.TEST_PATH.trim()) {
    args.push(config.TEST_PATH.trim());
  }

  if (config.TEST_TAG.trim()) {
    args.push("--grep", config.TEST_TAG.trim());
  }

  return runCommand("npx", args, true);
}

// Main Pipeline
function main() {
  let exitCode = 1;

  try {
    console.log("=================================");
    console.log(" RailERP_Automation CI/CD Pipeline");
    console.log("=================================");

    installDependencies();
    writeEnv();
    cleanOldResults();

    exitCode = runTests();

    if (exitCode === 0) {
      console.log("\nRailERP Automation PASSED");
    } else {
      console.error("\nRailERP Automation FAILED");
    }
  } catch (error) {
    console.error("Pipeline Error:", error.message);
    exitCode = 1;
  } finally {
    console.log("\nGenerated Reports:");
    console.log("playwright-report/index.html");
    console.log("custom-report/index.html");
    console.log("allure-results/");

    process.exitCode = exitCode;
  }
}

main();
