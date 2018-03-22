
// Note: jest runs all files that end with ".test.js"

// const puppeteer = require('puppeteer');
// const sessionFactory = require('./factories/sessionFactory');
// const userFactory = require('./factories/userFactory');
const Page = require('./helpers/page');

// test('Adds two numbers', () => {
//     const sum = 1 + 2;

//     expect(sum).toEqual(3);
// });

// let browser, page;

let page;

beforeEach(async () => {
    // browser = await puppeteer.launch({
    //     headless: false // to show the UI
    // });
    // page = await browser.newPage();
    page = await Page.build();
    await page.goto('localhost:3000');
});

afterEach(async () => {
    // await browser.close();
    await page.close();
})

test('the header has the correct text', async () => {
    // Basically, the function passed below gets run in the console of the Chromium Browser.
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);

    expect(text).toEqual('Blogster');
});

test('clicking login start oauth flow', async () => {
    await page.click('.right a');

    const url = await page.url();

    expect(url).toMatch(/accounts\.google\.com/);
});

test('when signed in, shows logout button', async () => { // test.only() to run only this test
    await page.login();

    // const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
    const text = await page.getContentsOf('a[href="/auth/logout"]');

    expect(text).toEqual('Logout');
});
