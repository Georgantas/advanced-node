
// Note: jest runs all files that end with ".test.js"

const puppeteer = require('puppeteer');

test('Adds two numbers', () => {
    const sum = 1 + 2;

    expect(sum).toEqual(3);
});

test('We can launch a browser', async () => {
    const browser = await puppeteer.launch({
        headless: false // to show the UI
    });
    const page = await browser.newPage();
    await page.goto('localhost:3000');

    // Basically, the function passed below gets run in the console of the Chromium Browser.
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);

    expect(text).toEqual('Blogster');
});
