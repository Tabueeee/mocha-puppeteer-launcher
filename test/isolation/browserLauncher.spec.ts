import * as assert from 'assert';
import {Browser, EmulateOptions, Page} from 'puppeteer';
import {SinonSpy} from 'sinon';
import {BrowserLauncher} from '../../src/BrowserLauncher';
import {MplConfig} from '../../src/interfaces/MplConfig';
import {PuppeteerModule} from '../../src/interfaces/PuppeteerModule';
import {getBrowserLauncherDouble, getPageDouble, mplConfigFake, puppeteerDouble} from '../common/helpers';
import {TestDouble} from '../common/TestDouble';

describe('browserLauncher', () => {

    let browserLauncher: TestDouble<BrowserLauncher>;

    it('puppeteer gets called as expected and returns expected browserFake', async () => {
        let browserFake: TestDouble<Browser> = {};

        browserLauncher = getBrowserLauncherDouble(browserFake);
        await browserLauncher.start(mplConfigFake);
        await browserLauncher.getPuppeteerLoadedPromise();

        assert.ok((<SinonSpy> puppeteerDouble.launch).called);
        assert.deepStrictEqual(browserLauncher.getBrowser(), browserFake);
    });

    it('browserLauncher does not call puppeteer twice', async () => {
        let p: Promise<void> = new Promise((resolve: () => void): void => {
            setTimeout(
                () => {
                    resolve();
                },
                5000
            );
        });

        let puppeteerDouble: TestDouble<PuppeteerModule> = {launch: (): Promise<void> => p};

        browserLauncher = new BrowserLauncher(<PuppeteerModule> puppeteerDouble);

        browserLauncher.start(mplConfigFake);
        let p1 = browserLauncher.getPuppeteerLoadedPromise();
        browserLauncher.start(mplConfigFake);
        let p2 = browserLauncher.getPuppeteerLoadedPromise();

        assert.deepStrictEqual(p1, p2);
    });

    it('no Promise returned, if browser was not started', async () => {
        let browserFake: TestDouble<Browser> = {};
        browserLauncher = getBrowserLauncherDouble(browserFake);

        assert.deepStrictEqual(browserLauncher.getPuppeteerLoadedPromise(), undefined);
    });

    it('throws if getBrowser was called, when browser was not started', async () => {
        browserLauncher = new BrowserLauncher(<PuppeteerModule> {});
        assert.throws(() => {
            browserLauncher.getBrowser();
        });
    });

    it('Page is created as expected', async () => {
        let browserFake: TestDouble<Browser> = {
            newPage: (): any => {
                return {some: 'prop'};
            }
        };

        browserLauncher = getBrowserLauncherDouble(browserFake);
        await browserLauncher.start(mplConfigFake);

        assert.deepStrictEqual(await browserLauncher.newPage(), {some: 'prop'});
    });

    it('Page is created as expected, with pageOptions', async () => {
        let browserFake: TestDouble<Browser> = {
            newPage: getPageDouble
        };

        browserLauncher = getBrowserLauncherDouble(browserFake);
        await browserLauncher.start(mplConfigFake);

        let page: Page = await browserLauncher.newPage({});

        assert.ok((<SinonSpy> page.setViewport).called === false && (<SinonSpy> page.setUserAgent).called === false);
    });


    it('Page is created as expected, with pageOptions', async () => {
        let browserFake: TestDouble<Browser> = {
            newPage: getPageDouble
        };

        browserLauncher = getBrowserLauncherDouble(browserFake);
        await browserLauncher.start(mplConfigFake);

        let page: Page = await browserLauncher.newPage({viewport: {}, userAgent: ''});

        assert.ok((<SinonSpy> page.setViewport).called === true && (<SinonSpy> page.setUserAgent).called === true);
    });

    it('emulate is called with passed arguments', async () => {
        let emulateOptions: EmulateOptions = {viewport: {width: 1000, height: 1000}};
        let emulateOptionsCalledWith: undefined | EmulateOptions;
        let browserFake: TestDouble<Browser> = {
            newPage: (): TestDouble<Page> => {
                return {
                    setViewport: (options: EmulateOptions): void => {
                        emulateOptionsCalledWith = options;
                    }
                };
            }
        };

        browserLauncher = getBrowserLauncherDouble(browserFake);

        await browserLauncher.start(mplConfigFake);
        await browserLauncher.newPage(emulateOptions);

        assert.deepStrictEqual(emulateOptionsCalledWith, emulateOptions.viewport);
    });

    it('getBrowser throws exception after the browser was closed', async () => {
        let calledClose: boolean = false;
        let browserFake: TestDouble<Browser> = {
            close: (): void => {
                calledClose = true;
            }
        };
        browserLauncher = getBrowserLauncherDouble(browserFake);
        browserLauncher.start(<MplConfig> {});
        await browserLauncher.getPuppeteerLoadedPromise();
        await browserLauncher.closeBrowser();

        assert.ok(calledClose);

        assert.throws(() => {
            browserLauncher.getBrowser();
        });
    });

    it('close browser with delay is called', async () => {
        let calledClose: boolean = false;
        let browserFake: TestDouble<Browser> = {
            close: (): void => {
                calledClose = true;
            }
        };

        browserLauncher = getBrowserLauncherDouble(browserFake);
        browserLauncher.start(<MplConfig> {});
        await browserLauncher.getPuppeteerLoadedPromise();
        await browserLauncher.closeBrowser(20);

        let p: Promise<void> = new Promise((resolve: () => void): void => {
            setTimeout(
                () => {
                    assert.ok(calledClose);
                    resolve();
                },
                50
            );
        });

        await p;
    });

    it('newPage throws exception after browser was closed', async () => {
        let calledClose: boolean = false;
        let browserFake: TestDouble<Browser> = {
            close: (): void => {
                calledClose = true;
            }
        };
        browserLauncher = getBrowserLauncherDouble(browserFake);
        browserLauncher.start(<MplConfig> {});
        await browserLauncher.getPuppeteerLoadedPromise();
        await browserLauncher.closeBrowser();

        assert.ok(calledClose);
        let err: Error | any;

        try {
            await browserLauncher.newPage();
        } catch (error) {
            err = error;
        }

        err = err || {message: ''};
        assert.equal(err.message, 'browser not initialized.');
    });

    it(`closing the browser when its closed`, (done: () => void) => {
        browserLauncher = getBrowserLauncherDouble({});
        assert.doesNotThrow(() => {
            browserLauncher
                .closeBrowser()
                .then(done);
        });
    });

    it('launched', (done: () => void) => {
        let tmp: () => never = process.exit;
        let exitCalled: boolean = false;
        // @ts-ignore: testcode
        process.exit = (_code?: number | undefined): any => {
            exitCalled = true;
        };

        let puppeteerDouble: TestDouble<PuppeteerModule> = {
            launch: async (): Promise<Browser> => {
                return new Promise((_resolve: (browser: Browser) => void, reject: (err: Error) => void): void => {
                    setTimeout(
                        () => {
                            reject(new Error('err'));
                        },
                        2000
                    );
                });
            }
        };

        browserLauncher = new BrowserLauncher(<PuppeteerModule> puppeteerDouble);
        browserLauncher.start(<MplConfig> {});

        let promise: Promise<void> | void = browserLauncher.getPuppeteerLoadedPromise();
        if (promise instanceof Promise) {
            promise
                .catch((_err: Error) => {
                    assert.ok(true);
                    assert.ok(exitCalled);
                    process.exit = tmp;
                    done();
                });
        }
    });
});
