import { expect } from "@playwright/test";

export class StatePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Click Add New State and verify required fields.
   */
  async addNewState() {
    await this.page
      .getByRole("link", { name: "Add New State", exact: true })
      .click();

    // Verify Add State heading
    await expect(
      this.page.getByRole("heading", { name: "Add State", exact: true }),
    ).toBeVisible();

    // Verify form fields
    await expect(this.page.locator("#name")).toBeVisible();
    await expect(this.page.locator("#code")).toBeVisible();
    await expect(this.page.locator("#active_status")).toBeVisible();

    // Verify Save button
    await expect(
      this.page.getByRole("button", { name: "Save", exact: true }),
    ).toBeVisible();
  }

  /**
   * Fill State Name.
   * @param {string} name
   */
  async stateName(name) {
    await this.page.locator("#name").fill(name);
  }

  /**
   * Fill State Code.
   * @param {string} code
   */
  async stateCode(code) {
    await this.page.locator("#code").fill(code);
  }

  /**
   * Select State Active Status.
   * @param {string|number} status
   */
  async activeStatus(status) {
    await this.page.locator("#active_status").selectOption(String(status));
  }

  /**
   * Click Save button.
   */
  async saveState() {
    // Click Save button
    await this.page.getByRole("button", { name: "Save", exact: true }).click();

    // Verify State created successfully
    const successMessage = this.page.getByText("State created successfully.", {
      exact: true,
    });
    await expect(successMessage).toBeVisible({ timeout: 10000 });

    // Dismiss success notification
    await this.page
      .getByRole("button", { name: "Dismiss notification", exact: true })
      .click();
  }

  /**
   * Search State by name.
   * @param {string} stateName
   */
  async searchState(stateName) {
    const searchInput = this.page.locator('input[type="text"].w-56');

    await expect(searchInput).toBeVisible();

    await searchInput.fill("");

    await searchInput.fill(stateName);

    await expect(searchInput).toHaveValue(stateName);
  }

  /**
   * Locate matching State table row.
   * @param {string} stateName
   */
  stateRow(stateName) {
    return this.page.locator(".index-list-datatable tbody tr").filter({
      has: this.page
        .locator("td:nth-child(2)")
        .getByText(stateName, { exact: true }),
    });
  }

  /**
   * Verify created State in listing.
   *
   * @param {string} stateName
   * @param {string} stateCode
   */
  async stateListAssert(stateName, stateCode) {
    await this.searchState(stateName);

    const row = this.stateRow(stateName);

    await expect(row).toHaveCount(1);

    // Verify State Name
    await expect(row.locator("td:nth-child(2)")).toHaveText(stateName);

    // Verify State Code
    await expect(row.locator("td:nth-child(3)")).toHaveText(stateCode);

    // Verify Districts count
    await expect(row.locator("td:nth-child(4)")).toHaveText(/^\d+$/);
  }

  /**
   * Performs Edit, Delete, or View action on a State.
   *
   * @param {string} stateName - State Name.
   * @param {string} action - edit, delete, or view.
   * @param {string} code - Expected State Code.
   * @param {string} status - Expected State Status.
   *
   * @throws {Error} If an invalid action is provided.
   */
  async stateActions(stateName, action, code, status ,newStateName ,newStateCode) {
    const row = this.stateRow(stateName);

    await expect(row).toHaveCount(1);

    switch (action.toLowerCase()) {
        case "edit":
        await this.page.waitForTimeout(4000);
        await row.getByRole("link", { name: `Edit ${stateName}`, exact: true }).click();
        await this.editRecord(stateName, newStateName, newStateCode)
        break;
        case "delete":
        await row.getByRole("button", { name: `Delete ${stateName}`, exact: true }).click();
        await this.clickDelete();
        break;
        case "view":
        await this.page.waitForTimeout(4000);
        // Click View icon
        const viewLink = row.locator(`a[aria-label="View ${stateName}"]`);
        await viewLink.waitFor({ state: "visible" });
        await viewLink.click();

        await this.viewRecord(stateName, code, status);
        break;

      default:
        throw new Error(`Invalid State Action: ${action}`);
    }
  }

  /**
   * Verify State details on View page.
   *
   * @param {string} stateName - Expected State Name.
   * @param {string} code - Expected State Code.
   * @param {string} status - Expected Status (Active / Inactive).
   */
  async viewRecord(stateName, code, status) {
    // Find State Row using dynamically generated State Name
    const row = this.stateRow(stateName);

    await expect(row).toHaveCount(1);

    // Locate State details card
    const card = this.page
      .locator("div.rounded-xl.border")
      .filter({ has: this.page.getByText(stateName, { exact: true }) });

    await card.waitFor({ state: "visible" });

    // Verify State details card
    await expect(card).toHaveCount(1);
    await expect(card).toBeVisible();

    // Verify State Name
    await expect(card.getByText(stateName, { exact: true })).toBeVisible();

    // Verify State Code
    await expect(card.getByText(code, { exact: true })).toBeVisible();

    // Verify State Status
    await expect(card.getByText(status, { exact: true })).toBeVisible();

    // Back to State List
    await this.backToList();
  }

  /**
 * Edit an existing State record.
 *
 * @param {string} stateName - Existing State Name.
 * @param {string} newStateName - New State Name.
 * @param {string} newStateCode - New State Code.
 */
async editRecord(stateName, newStateName, newStateCode) {

    // Find State row
    const row = this.stateRow(stateName);
    await expect(row).toHaveCount(1);


    // Locate Edit fields
    const stateNameInput = this.page.locator("#name");
    const stateCodeInput = this.page.locator("#code");

    // Wait for Edit form
    await expect(stateNameInput).toBeVisible();
    await expect(stateCodeInput).toBeVisible();

    // Verify existing State Name
    await expect(stateNameInput).toHaveValue(stateName);

    // Clear and enter new State Name
    await stateNameInput.clear();
    await stateNameInput.fill(newStateName);

    // Clear and enter new State Code
    await stateCodeInput.clear();
    await stateCodeInput.fill(newStateCode);

    // Verify updated values
    await expect(stateNameInput).toHaveValue(newStateName);
    await expect(stateCodeInput).toHaveValue(newStateCode);

    // Click Save changes
    await this.page.getByRole("button", {
        name: "Save changes",
        exact: true
    }).click();
}



  /**
   * Return from View page to State List.
   */
  async backToList() {
    await this.page
      .getByRole("link", { name: "Back to List", exact: true })
      .click();
  }

  /**
   * Confirm State deletion.
   */
  async clickDelete() {
    await this.page
      .getByRole("button", { name: "Delete", exact: true })
      .click();

    await this.verifyStateDeletedSuccessfully();
  }

  /**
   * Verify successful State deletion.
   */
  async verifyStateDeletedSuccessfully() {
    await expect(
      this.page.getByText("State deleted successfully.", { exact: true }),
    ).toBeVisible();
  }
}
