
import { PageManagers } from "../../page-manager/Page-Manager.js";
import stateData from "../../tests/test-data-management/state/State.json";
import { Utils } from "../../utils/Utils.js";

export class StatePageTC {

    constructor(page) {
        this.page = page;
        this.pm = new PageManagers(page);
    }

    async createStates() {

        // Generate unique State Name
        const stateName = Utils.generateStateName(stateData.addState.stateName);

        // Generate unique State Code
        const stateCode = Utils.generateStateCode();

        console.log("Generated State Name:", stateName);
        console.log("Generated State Code:", stateCode);

        // Step 1: Create State
        await this.createState(stateName,stateCode,stateData.addState.activeStatus
        );

        // Step 2: Search and assert State list
        await this.listAssertView(stateName, stateCode);

        // Return generated values
        return {
            stateName,
            stateCode
        };
    }

    async createState(stateName, stateCode, status) {

        await this.pm.navigatepage.State();

        await this.pm.statePage.addNewState();

        await this.pm.statePage.stateName(stateName);

        await this.pm.statePage.stateCode(stateCode);

        await this.pm.statePage.activeStatus(status);

        await this.pm.statePage.saveState();
    }

    async listAssertView(stateName, stateCode) {

        // Search and verify created State
        await this.pm.statePage.stateListAssert(
            stateName,
            stateCode
        );

        // Delete State
        await this.pm.statePage.stateActions(stateName,'delete');

    }
}
