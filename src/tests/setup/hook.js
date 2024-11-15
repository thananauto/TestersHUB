
const { setDefaultTimeout, Before, After, Status, setWorldConstructor  } = require('@cucumber/cucumber')
const { chromium } = require('@playwright/test')

const CustomWorld = require('./../setup/custom.world')

require('dotenv').config()

setWorldConstructor(CustomWorld)
setDefaultTimeout(60 * 1000 * 2)

Before(async function () {
    this.browser = await chromium.launch({ headless: false });  // Launching the browser
    this.context = await this.browser.newContext(); // Creating a new context
    this.page = await this.context.newPage(); // Creating a new page
    await this.initSetUp(this.page)
  });
  
After(async function ({ result, pickle }) {
    if (result?.status == Status.FAILED) {
        const img = await this.page.screenshot({
            path: `./test-results/screenshots/${pickle.name}.png`,
            type: 'png',
        })
        this.attach(img, 'image/png')
    }
    await this.page.close();  // Closing the page
    await this.browser.close();  // Closing the browser after the test
});
  