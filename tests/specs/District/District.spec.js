
import { test } from '@playwright/test';
import { appUrls } from '../../../playwright.config.js';
import { PageManagers } from '../../../page-manager/Page-Manager.js';
import loginData from '../../test-data-management/login/Login.json';
import { DistrictPageTC } from '../../../testcases/district-tc/DistrictTc.js';

test.describe('RailERP District Master Automation', () => {

    let page;
    let context;

    test.beforeEach(async ({ browser }) => {

        // Create browser context
        context = await browser.newContext({
            ignoreHTTPSErrors: true
        });

        // Create new page
        page = await context.newPage();

        // Navigate to RailERP login
        await page.goto(appUrls.loginURL);

    });

    test.afterEach(async () => {
        await context?.close();
    });

    test('Verify District Master Screen – Create a District, Validate the Created District, and Delete the District', async () => {

        const pm = new PageManagers(page);
        const districtTc = new DistrictPageTC(page);

        // Login to RailERP
        await pm.loginPage.loginPage(
            loginData.validLogin.username,
            loginData.validLogin.password,
            loginData.validLogin.checkbox
        );

        // Execute District test cases
        await districtTc.createDistricts();

    });

});
