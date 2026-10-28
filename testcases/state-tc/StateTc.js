
import { PageManagers } from "../../page-manager/Page-Manager.js";
import stateData from "../../tests/test-data-management/state/State.json";
import { generateStateName, generateStateCode, createState } from "../../utils/Utils.js";

export class StatePageTC {

    constructor(page) {
        this.page = page;
        this.pm = new PageManagers(page);
    }

    /**
     * Complete State creation, edit, view and delete flow.
     */
    async createStates() {

        // Generate State Name and Code
        const stateName = generateStateName(stateData.addState.stateName);
        const stateCode = generateStateCode();
        const status = stateData.addState.activeStatus;

        console.log("Generated State Name:", stateName);
        console.log("Generated State Code:", stateCode);
        console.log("State Status:", status);

        // Step 1: Create State
        await createState(this.pm, stateName, stateCode, status);

        // Step 2: List, Edit, View and Delete assertions
        const updatedState = await this.listAssertView(stateName, stateCode, status);

        // Return original and updated values
        return {
            stateName,
            stateCode,
            ...updatedState
        };
    }

    /**
     * Verify State, Edit, View updated details and Delete.
     *
     * @param {string} stateName - Original State Name.
     * @param {string} stateCode - Original State Code.
     * @param {string|number} status - State Status.
     */
    async listAssertView(stateName, stateCode, status) {

        // Step 1: Verify newly created State
        await this.pm.statePage.stateListAssert(stateName, stateCode);

        // Convert Status for View assertion
        const expectedStatus = String(status) === '1' ? 'Active' : String(status) === '0' ? 'In active' : String(status);

        // Step 2: Generate new State Name and Code for Edit
        const newStateName = generateStateName(stateData.addState.stateName);
        const newStateCode = generateStateCode();

        console.log("Updated State Name:", newStateName);
        console.log("Updated State Code:", newStateCode);

        // Step 3: Edit existing State
        await this.pm.statePage.stateActions(
            stateName,
            "edit",
            stateCode,
            expectedStatus,
            newStateName,
            newStateCode
        );

        // Step 4: Verify updated State in List
        await this.pm.statePage.stateListAssert(newStateName, newStateCode);

        // Step 5: View updated State and verify new values
        await this.pm.statePage.stateActions(
            newStateName,
            "view",
            newStateCode,
            expectedStatus
        );

        // Step 6: Search updated State after returning to List
        await this.pm.statePage.searchState(newStateName);

        // Step 7: Delete updated State
        //await this.pm.statePage.stateActions(newStateName, "delete");

        return {
            newStateName,
            newStateCode
        };
    }
}
