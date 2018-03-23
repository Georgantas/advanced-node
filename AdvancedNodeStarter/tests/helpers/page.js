
const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage { // could be called Page instead
    static async build() {
        const browser = await puppeteer.launch({
            // headless: false
            headless: true,
            args: ['--no-sandbox']
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
        await this.page.goto('http://localhost:3000/blogs');
        await this.page.waitFor('a[href="/auth/logout"]');
    }

    async getContentsOf(selector) {
        return this.page.$eval(selector, el => el.innerHTML);
    }

    get(path) {
        return this.page.evaluate((_path) => {
            return fetch(_path, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json());
        }, path);
        
    }

    post(path, data) {
        return this.page.evaluate((_path, _data) => {
            // NOTE: THE FOLLOWING GETS TURNED TO A STRING, SO WE CANT REFERENCE "PATH" DIRECTLY
            // That's why it's provided as a second argument.
            return fetch(_path, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(_data)
            }).then(res => res.json());
        }, path, data);
    }

    execRequests(actions){
        return Promise.all(actions.map(({ method, path, data }) => {
            return this[method](path, data);
        }));
    }
}

module.exports = CustomPage;
