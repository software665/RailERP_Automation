import { Page, expect } from "@playwright/test";


export class NavigatePages {

    constructor(page) {
        this.page = page;
    }

    async expandSidebar() {
        const expandButton = this.page.getByRole('button', {
            name: 'Expand sidebar',
        });

        const collapseButton = this.page.getByRole('button', {
            name: 'Collapse sidebar',
        });

        if (await expandButton.isVisible()) {
            await expandButton.click();
        }

        await collapseButton.waitFor({ state: 'visible' });

        console.log('Sidebar is expanded and fixed.');
    }

    async admin() {
        await this.expandSidebar();
        await this.page.getByRole('link', { name: 'Admin' }).click();
    }

    async masters() {
        await this.expandSidebar();
        await this.page.getByRole('link', { name: 'Masters', exact: true }).click();
    }

    async State() {
        await this.masters()
        await this.page.locator('a[href="/RailERP-Staging/admin/states"]').click();
    }


}
