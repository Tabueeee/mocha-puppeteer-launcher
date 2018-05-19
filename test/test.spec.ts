import * as assert from 'assert';
import {Page} from 'puppeteer';
import {config} from '../src';


describe('register-require', () => {

    before(() => {
        config.browserOptions.args = ['--no-sandbox'];
        require('../../register');
    });

    it('newPage', () => {
        assert.ok(typeof newPage === 'function');
    });

    it('closeBrowser', () => {
        assert.ok(typeof closeBrowser === 'function');
    });

    it('page.constructor', async () => {
        let page: Page = await newPage({viewport: {height: 1268, width: 1024}, userAgent: ''});

        assert.ok(page.constructor.name === 'Page');
    });
});
