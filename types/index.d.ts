import {Options} from 'find-up';
import {Browser, EmulateOptions, LaunchOptions, Page} from 'puppeteer';

interface MplConfig {
    browserOptions: LaunchOptions;
    autoClose: boolean;
    keepAlive: number;
}

declare global {
    export function newPage(options?: EmulateOptions): Promise<Page>;

    export function closeBrowser(keepAlive?: number): Promise<void>;

    export const mplConfig: MplConfig;
}

declare module 'mocha-puppeteer-launcher' {
    export const config: MplConfig;
    export const browserLauncher: BrowserLauncher;
    export const register: () => void;

    interface PuppeteerModule {
        launch(options?: LaunchOptions): Promise<Browser>;
    }

    class BrowserLauncher {
        private browser;
        private puppeteerLoadedPromise;
        private timer;
        private puppeteer;

        constructor(puppeteer: PuppeteerModule);

        public getPuppeteerLoadedPromise(): Promise<void> | void;

        public closeBrowser(keepAlive?: number): Promise<void>;

        public getBrowser(): Browser;

        public newPage(options?: EmulateOptions): Promise<Page>;

        public start(config: MplConfig): Promise<void>;

        private close();

        private initialize(options);

        private startTimeoutTimer(config, reject);

        private stopTimeoutTimer();
    }

    class JsonReader {
        public loadByPath(filePath: string): Partial<MplConfig>;
    }

    class ConfigResolver {
        private config;
        private findUpSync;
        private argv;
        private fileReader;
        private readonly defaultConfig;

        constructor(argv: Array<string>, findUpSync: (filename: string | Array<string>, options?: Options) => string | null, fileReader: JsonReader);

        public getConfig(): MplConfig;

        public loadConfig(): void;

        private autoLoad();
    }

    namespace Const {
        const OPTION_FILE_NAME: string;
        const ARGV_OPTION_NAME: string;
    }

    class ReferenceResolver {
        private referenceLoaders;

        constructor(referenceLoaders: Array<(name: string) => any>);

        public getReference(name: string): any;
    }
}
