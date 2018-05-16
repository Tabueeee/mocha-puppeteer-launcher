import {Browser, Page} from 'puppeteer';
import * as sinon from 'sinon';
import {BrowserLauncher} from '../../src/BrowserLauncher';
import {MplConfig} from '../../src/interfaces/MplConfig';
import {PuppeteerModule} from '../../src/interfaces/PuppeteerModule';
import {TestDouble} from './TestDouble';

export let puppeteerDouble: TestDouble<PuppeteerModule>;

export function getPageDouble(): TestDouble<Page> {
    return {
        setViewport: sinon.spy(),
        setUserAgent: sinon.spy()
    };
}

export function getBrowserLauncherDouble(browserFake: TestDouble<Browser>): TestDouble<BrowserLauncher> {
    puppeteerDouble = {
        launch: async (): Promise<Browser> => {

            return <Browser> browserFake;
        }
    };

    sinon.spy(puppeteerDouble, 'launch');

    return new BrowserLauncher(<PuppeteerModule> puppeteerDouble);
}

export const mplConfigFake: TestDouble<MplConfig> = {
    browserOptions: {
        headless: true,
        ignoreHTTPSErrors: true
    }
};
