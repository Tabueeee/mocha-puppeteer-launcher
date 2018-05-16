import {LaunchOptions} from 'puppeteer';

export interface MplConfig {
    browserOptions: LaunchOptions;
    autoClose: boolean;
    keepAlive: number;
}
