
const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage { // could be called Page instead
    static async build() {
        const browser = await puppeteer.launch({
            headless: false
        });

        const page = await browser.newPage();
        const customPage = new CustomPage(page);

        return new Proxy(customPage, {
            get: function(target, property) {
                // Personally don't like the fact that we're adding browser[property].
                // What if, in the future, both page and browser, get a close() method for example.
                // We'll always be calling the one in page, since it has precedence.
                // return customPage[property] || page[property] || browser[property];

                // Temporary solution:
                return customPage[property] || browser[property] || page[property];
            }
        });
    }

    constructor(page){
        this.page = page;
    }

    async login() {
        const user = await userFactory();
        const { session, sig } = sessionFactory(user);

        await this.page.setCookie({ name: 'session', value: session });
        await this.page.setCookie({ name: 'session.sig', value: sig });
        await this.page.goto('localhost:3000/blogs');
        await this.page.waitFor('a[href="/auth/logout"]');
    }

    async getContentsOf(selector) {
        return this.page.$eval(selector, el => el.innerHTML);
    }
}

module.exports = CustomPage;
