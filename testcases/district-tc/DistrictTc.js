
import { PageManagers } from "../../page-manager/Page-Manager.js";

import districtData from "../../tests/test-data-management/district/District.json";
import { generateDistrictName, generateDistrictCode, createDistrict } from "../../utils/Utils1.js";

import {
    generateDistrictName,
    generateDistrictCode,
    createDistrict
} from "../../utils/Utils1.js";

export class DistrictPageTC {

    constructor(page) {
        this.page = page;
        this.pm = new PageManagers(page);
    }

    /**
     * Complete District creation, edit, view and delete flow.
     */
    async createDistricts() {

        // Generate District Name and Code
        const districtName = generateDistrictName(
            districtData.addDistrict.districtName
        );

        const districtCode = generateDistrictCode();

        const stateId = districtData.addDistrict.stateId;
        const status = districtData.addDistrict.activeStatus;

        console.log("Generated District Name:", districtName);
        console.log("Generated District Code:", districtCode);
        console.log("Selected State ID:", stateId);
        console.log("District Status:", status);

        // Step 1: Create District
        await createDistrict(
            this.pm,
            stateId,
            districtName,
            districtCode,
            status
        );

        // Step 2: List, Edit, View and Delete assertions
        const updatedDistrict = await this.listAssertView(
            districtName,
            districtCode,
            status
        );

        // Return original and updated values
        return {
            districtName,
            districtCode,
            ...updatedDistrict
        };
    }

    /**
     * Verify District, Edit, View and Delete.
     *
     * @param {string} districtName - Original District Name.
     * @param {string} districtCode - Original District Code.
     * @param {string|number} status - District Status.
     */
    async listAssertView(districtName, districtCode, status) {

        // Step 1: Verify newly created District
        await this.pm.districtPage.districtListAssert(
            districtName,
            districtCode
        );

        // Convert Status for View assertion
        const expectedStatus =
            String(status) === "1"
                ? "Active"
                : String(status) === "0"
                    ? "In active"
                    : String(status);

        // Step 2: Generate new District Name and Code for Edit
        const newDistrictName = generateDistrictName(
            districtData.addDistrict.districtName
        );

        const newDistrictCode = generateDistrictCode();

        console.log("Updated District Name:", newDistrictName);
        console.log("Updated District Code:", newDistrictCode);

        // Step 3: Edit existing District
        await this.pm.districtPage.districtActions(
            districtName,
            "edit",
            districtCode,
            expectedStatus,
            newDistrictName,
            newDistrictCode
        );

        // Step 4: Verify updated District in List
        await this.pm.districtPage.districtListAssert(
            newDistrictName,
            newDistrictCode
        );

        // Step 5: View updated District and verify details
        await this.pm.districtPage.districtActions(
            newDistrictName,
            "view",
            newDistrictCode,
            expectedStatus
        );

        // Step 6: Search updated District after returning to List
        await this.pm.districtPage.searchDistrict(
            newDistrictName
        );

        // Step 7: Delete updated District
        // await this.pm.districtPage.districtActions(
        //     newDistrictName,
        //     "delete"
        // );

        return {
            newDistrictName,
            newDistrictCode
        };
    }
}
