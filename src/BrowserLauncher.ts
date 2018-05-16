import {Browser, EmulateOptions, LaunchOptions, Page} from 'puppeteer';
import {MplConfig} from './interfaces/MplConfig';
import {PuppeteerModule} from './interfaces/PuppeteerModule';

export class BrowserLauncher {

    private browser: Browser | undefined;
    private puppeteerLoadedPromise: Promise<void> | undefined;
    private puppeteer: PuppeteerModule;

    public constructor(puppeteer: PuppeteerModule) {
        this.puppeteer = puppeteer;
    }

    public getPuppeteerLoadedPromise(): Promise<void> | void {
        if (this.puppeteerLoadedPromise instanceof Promise) {

            return this.puppeteerLoadedPromise;
        }
    }

    public async closeBrowser(keepAlive?: number): Promise<void> {
        if (typeof keepAlive === 'number' && keepAlive > 0) {
            setTimeout(this.close.bind(this), keepAlive);
        } else {
            await this.close();
        }
    }

    public getBrowser(): Browser {
        if (typeof this.browser === 'undefined') {
            throw new Error('browser not initialized.');
        }

        return this.browser;
    }

    public async newPage(options?: EmulateOptions): Promise<Page> {
        if (this.puppeteerLoadedPromise instanceof Promise) {
            await this.puppeteerLoadedPromise;
        }

        if (typeof this.browser === 'undefined') {
            throw new Error('browser not initialized.');
        }

        let page: Page = await this.browser.newPage();

        if (typeof options !== 'undefined') {
            if (typeof options.viewport !== 'undefined') {
                await page.setViewport(options.viewport);
            }

            if (typeof options.userAgent !== 'undefined') {
                await page.setUserAgent(options.userAgent);
            }
        }

        return page;
    }

    public start(config: MplConfig): Promise<void> {
        if (typeof this.puppeteerLoadedPromise === 'undefined') {
            this.puppeteerLoadedPromise = new Promise(
                async (resolve: () => void, reject: (error?: Error) => void): Promise<void> => {

                    try {
                        await this.initialize(config.browserOptions);
                    } catch (error) {
                        reject(error);
                    }

                    resolve();
                }
            );

            this.puppeteerLoadedPromise
                .catch((error: Error) => {
                    console.error(error.message);
                    process.exit(2);
                });
        }

        return this.puppeteerLoadedPromise;
    }

    private async close(): Promise<void> {
        if (typeof this.browser !== 'undefined') {
            await this.browser.close();
            delete this.browser;
            delete this.puppeteerLoadedPromise;
        }
    }

    private async initialize(options: LaunchOptions): Promise<void> {
        this.browser = await this.puppeteer.launch(options);
    }
}
