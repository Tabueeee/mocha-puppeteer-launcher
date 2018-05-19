import {sync} from 'find-up';
import {BrowserLauncher} from './BrowserLauncher';
import {ConfigResolver} from './ConfigResolver';
import {MplConfig} from './interfaces/MplConfig';
import {JsonReader} from './JsonReader';
import {ReferenceResolver} from './ReferenceResolver';

const configResolver: ConfigResolver = new ConfigResolver(process.argv, sync, new JsonReader());
// @ts-ignore: check why "typeof require.main !== 'undefined'" reports false negative, thus preventing usage
const referenceLoaders: Array<(name: string) => any> = [require, require.main.require];
const referenceResolver: ReferenceResolver = new ReferenceResolver(referenceLoaders);

export const config: MplConfig = configResolver.getConfig();

export const browserLauncher: BrowserLauncher = new BrowserLauncher(referenceResolver.getReference('puppeteer'));

export const register: () => void = (): void => {
    browserLauncher.start(config);

    if (config.autoClose === true) {
        process.nextTick(() => {
            after(browserLauncher.closeBrowser.bind(browserLauncher, config.keepAlive));
        });
    }

    global['newPage'] = browserLauncher.newPage.bind(browserLauncher);
    global['closeBrowser'] = browserLauncher.closeBrowser.bind(browserLauncher);
};
