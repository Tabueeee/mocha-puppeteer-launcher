import {Browser, LaunchOptions} from 'puppeteer';

export interface PuppeteerModule {
    launch(options?: LaunchOptions): Promise<Browser>;
}
