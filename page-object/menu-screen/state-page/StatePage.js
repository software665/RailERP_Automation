
import { expect } from '@playwright/test';

export class StatePage {

    constructor(page) {
        this.page = page;
    }

  

    // Click Add New State and verify page
    async addNewState() {

        await this.page.getByRole('link', {
            name: 'Add New State',
            exact: true
        }).click();

        // Verify Add State heading
        await expect(
            this.page.getByRole('heading', {
                name: 'Add State',
                exact: true
            })
        ).toBeVisible();

        // Verify State Name field
        await expect(this.page.locator('#name')).toBeVisible();

        // Verify Code field
        await expect(this.page.locator('#code')).toBeVisible();

        // Verify Active Status dropdown
        await expect(this.page.locator('#active_status')).toBeVisible();

        // Verify Save button
        await expect(
            this.page.getByRole('button', {
                name: 'Save',
                exact: true
            })
        ).toBeVisible();
    }

    // Fill State Name
    async stateName(name) {
        await this.page.locator('#name').fill(name);
    }

    // Fill State Code
    async stateCode(code) {
        await this.page.locator('#code').fill(code);
    }

    // Select Active Status
    async activeStatus(status) {
        await this.page.locator('#active_status').selectOption(String(status))
    }

    // Click Save
    async saveState() {
        await this.page.getByRole('button', {name: 'Save',exact: true}).click();
    }

    // Complete Add State flow
    async createState(name, code, status) {

        await this.State();

        await this.addNewState();

        await this.stateName(name);

        await this.stateCode(code);

        await this.activeStatus(status);

        await this.saveState();
    }

       // Search created State Name
    async searchState(stateName) {

        const searchInput = this.page.locator('input[type="text"].w-56');

        await expect(searchInput).toBeVisible();

        await searchInput.fill(stateName);

        await expect(searchInput).toHaveValue(stateName);
    }

        // Find matching table row
    stateRow(stateName) {

        return this.page.locator(
            '.index-list-datatable tbody tr'
        ).filter({
            has: this.page.locator('td:nth-child(2)')
                .getByText(stateName, { exact: true })
        });
    }

    async stateListAssert(stateName, stateCode) {

        await this.searchState(stateName);

        const row = this.stateRow(stateName);

        await expect(row).toHaveCount(1);

        // State Name
        await expect(row.locator('td:nth-child(2)')).toHaveText(stateName);

        // State Code
        await expect( row.locator('td:nth-child(3)')).toHaveText(stateCode);

        // Districts count
        await expect(row.locator('td:nth-child(4)')).toHaveText(/^\d+$/);

    }

    
async stateActions(stateName, action) {

    const row = this.stateRow(stateName);

    await expect(row).toHaveCount(1);

    switch (action.toLowerCase()) {

        case 'edit':await row.getByRole('link', {name: `Edit ${stateName}`,exact: true}).click();
            break;

        case 'delete': await row.getByRole('button', {name: `Delete ${stateName}`,exact: true}).click();
                    await this.clickDelete();
                    
            break;

        case 'view': await row.getByRole('link', {name: `View ${stateName}`,exact: true}).click();
            break;

        default:
            throw new Error(`Invalid State Action: ${action}`);
    }


}

async clickDelete() {
  await this.page.getByRole('button', { name: 'Delete', exact: true }).click();
  await this.verifyStateDeletedSuccessfully();
}

async verifyStateDeletedSuccessfully() {
  await this.page.getByText('State deleted successfully.', { exact: true }).waitFor({state: 'visible',
  });
}




}
