
import { Page, expect } from '@playwright/test';

export class LoginPage {

    constructor(page) {
        this.page = page;
    }

    /**
     * @param userName passing string value in Username or email field
     * @param password passing string value in Password field
     * @param checkbox passing boolean value for Keep me signed in
     */

    async loginPage(userName, password, checkbox) {

        // Username or Email
        await this.userName(userName);

        // Password
        await this.password(password);

        // Keep me signed in checkbox
        if (checkbox) {
            await this.page.locator('.rl-check input[type="checkbox"]').check();
        } else {
            await this.page.locator('.rl-check input[type="checkbox"]').uncheck();
            console.log("Keep me signed in is not selected");
        }

        // Sign in
        await this.signinButton();

        //close
        await this.page.getByRole('button', { name: 'Close welcome message' }).click();

    }

    async invalidLogin(userName, password, checkbox) {

        // Perform login with invalid credentials
        await this.loginPage(userName, password, checkbox);

        // Verify invalid credentials error message
        await expect(
            this.page.locator('#email-error')).toHaveText('These credentials do not match our records.');

        console.log("Invalid login error message verified successfully");
    }
    

    async userName(name) {
        const uName = this.page.locator('#email');
        await uName.fill("")
        await uName.fill(name);
    }

    async password(pass) {
        const pWord = this.page.locator('#password');
        await pWord.fill("")
        await pWord.fill(pass);
    }

    async signinButton() {
        await this.page.getByRole('button', {
            name: 'Sign in',
            exact: true
        }).click();
    }

}
