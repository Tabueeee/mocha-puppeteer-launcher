import * as assert from 'assert';
import {Page} from 'puppeteer';
import {browserLauncher, config, register} from '../src/index';


describe('register-call', () => {

    before(async () => {
        config.autoClose = false;
        register();
        await browserLauncher.getPuppeteerLoadedPromise();
    });

    after(async () => {
        await browserLauncher.closeBrowser();
    });

    it('newPage', () => {
        assert.ok(typeof newPage === 'function');
    });

    it('closeBrowser', () => {
        assert.ok(typeof closeBrowser === 'function');
    });

    it('page.constructor', async () => {
        let page: Page = await newPage({viewport: {height: 1268, width: 1024}});

        assert.ok(page.constructor.name === 'Page');
    });
});
