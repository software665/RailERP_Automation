
import { Page } from "@playwright/test";
import { LoginPage } from "../page-object/menu-screen/login-page/Login";
import { NavigatePages } from "../page-object/navigate-screen/NavigatePage";
import { StatePage } from "../page-object/menu-screen/state-page/StatePage";

export class PageManagers {

    constructor(page) {
        this.page = page;
        //login page
        this.loginPage = new LoginPage(page);
        //state page
        this.statePage = new StatePage(page);

        //naviagte 
        this.navigatepage = new NavigatePages(page)
    }

    

}
