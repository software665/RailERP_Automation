
import { expect } from "@playwright/test";

export class DistrictPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Click Add New District and verify required fields.
   */
  async addNewDistrict() {
    await this.page
      .getByRole("link", { name: "Add New District", exact: true })
      .click();

    await expect(
      this.page.getByRole("heading", {
        name: "Add District",
        exact: true,
      })
    ).toBeVisible();

    // State dropdown
    await expect(this.page.locator("#state_id")).toBeVisible();

    // District fields
    await expect(this.page.locator("#name")).toBeVisible();
    await expect(this.page.locator("#code")).toBeVisible();
    await expect(this.page.locator("#active_status")).toBeVisible();

    // Save button
    await expect(
      this.page.getByRole("button", {
        name: "Save",
        exact: true,
      })
    ).toBeVisible();
  }

  /**
   * Select State.
   * @param {string|number} stateId
   */
  async selectState(stateId) {
    await this.page.locator("#state_id")
      .selectOption(String(stateId));
  }

  /**
   * Enter District Name.
   * @param {string} name
   */
  async districtName(name) {
    await this.page.locator("#name").fill(name);
  }

  /**
   * Enter District Code.
   * @param {string} code
   */
  async districtCode(code) {
    await this.page.locator("#code").fill(code);
  }

  /**
   * Select Active Status.
   * @param {string|number} status
   */
  async activeStatus(status) {
    await this.page.locator("#active_status")
      .selectOption(String(status));
  }

  /**
   * Save District.
   */
  async saveDistrict() {
    await this.page.getByRole("button", {
      name: "Save",
      exact: true,
    }).click();

    await expect(
      this.page.getByText("District created successfully.", {
        exact: true,
      })
    ).toBeVisible({ timeout: 10000 });
  }

  /**
   * Search District by name.
   * @param {string} districtName
   */
  async searchDistrict(districtName) {
    const searchInput = this.page.locator('input[type="text"].w-56');

    await expect(searchInput).toBeVisible();
    await searchInput.fill(districtName);

    await expect(searchInput).toHaveValue(districtName);
  }

  /**
   * Locate matching District row.
   * @param {string} districtName
   */
  districtRow(districtName) {
    return this.page
      .locator(".index-list-datatable tbody tr")
      .filter({
        has: this.page.locator("td:nth-child(2)")
          .getByText(districtName, { exact: true }),
      });
  }

  /**
   * Verify District listing.
   * @param {string} districtName
   * @param {string} districtCode
   */
  async districtListAssert(districtName, districtCode) {
    await this.searchDistrict(districtName);

    const row = this.districtRow(districtName);

    await expect(row).toHaveCount(1);

    await expect(row.locator("td:nth-child(2)"))
      .toHaveText(districtName);

    await expect(row.locator("td:nth-child(3)"))
      .toHaveText(districtCode);

    await expect(row.locator("td:nth-child(4)"))
      .toHaveText(/^\d+$/);
  }

  /**
   * Perform District actions.
   * @param {string} districtName
   * @param {string} action
   * @param {string} code
   * @param {string} status
   * @param {string} newDistrictName
   * @param {string} newDistrictCode
   */
  async districtActions(
    districtName,
    action,
    code,
    status,
    newDistrictName,
    newDistrictCode
  ) {
    const row = this.districtRow(districtName);

    await expect(row).toHaveCount(1);

    switch (action.toLowerCase()) {
      case "edit":
        await row.getByRole("link", {
          name: `Edit ${districtName}`,
          exact: true,
        }).click();

        await this.editRecord(
          districtName,
          newDistrictName,
          newDistrictCode
        );
        break;

      case "delete":
        await row.getByRole("button", {
          name: `Delete ${districtName}`,
          exact: true,
        }).click();

        await this.clickDelete();
        break;

      case "view":
        await row.locator(
          `a[aria-label="View ${districtName}"]`
        ).click();

        await this.viewRecord(districtName, code, status);
        break;

      default:
        throw new Error(`Invalid District Action: ${action}`);
    }
  }

  /**
   * Edit District.
   */
  async editRecord(districtName, newDistrictName, newDistrictCode) {
    const nameInput = this.page.locator("#name");
    const codeInput = this.page.locator("#code");

    await expect(nameInput).toBeVisible();
    await expect(codeInput).toBeVisible();

    await expect(nameInput).toHaveValue(districtName);

    await nameInput.fill(newDistrictName);
    await codeInput.fill(newDistrictCode);

    await expect(nameInput).toHaveValue(newDistrictName);
    await expect(codeInput).toHaveValue(newDistrictCode);

    await this.page.getByRole("button", {
      name: "Save changes",
      exact: true,
    }).click();
  }

  /**
   * View District details.
   */
  async viewRecord(districtName, code, status) {
    const card = this.page
      .locator("div.rounded-xl.border")
      .filter({
        has: this.page.getByText(districtName, {
          exact: true,
        }),
      });

    await expect(card).toBeVisible();

    await expect(
      card.getByText(districtName, { exact: true })
    ).toBeVisible();

    await expect(
      card.getByText(code, { exact: true })
    ).toBeVisible();

    await expect(
      card.getByText(status, { exact: true })
    ).toBeVisible();

    await this.backToList();
  }

  async backToList() {
    await this.page.getByRole("link", {
      name: "Back to List",
      exact: true,
    }).click();
  }

  async clickDelete() {
    await this.page.getByRole("button", {
      name: "Delete",
      exact: true,
    }).click();

    await this.verifyDistrictDeletedSuccessfully();
  }

  async verifyDistrictDeletedSuccessfully() {
    await expect(
      this.page.getByText("District deleted successfully.", {
        exact: true,
      })
    ).toBeVisible();
  }
}
