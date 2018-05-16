import * as assert from 'assert';
import {ConfigResolver} from '../../src/ConfigResolver';
import {Const} from '../../src/Const';
import {MplConfig} from '../../src/interfaces/MplConfig';
import {JsonReader} from '../../src/JsonReader';
import ARGV_OPTION_NAME = Const.ARGV_OPTION_NAME;

describe('ConfigResolver', () => {

    let configResolver: ConfigResolver;

    it('if no config is found, default config is loaded', () => {
        configResolver = new ConfigResolver([], (): null => null, <JsonReader> {});

        assert.deepEqual(configResolver.getConfig(), {
            browserOptions: {
                headless: true,
                ignoreHTTPSErrors: true   ,
                timeout: 30000
            },
            autoClose: true,
            keepAlive: 0
        });
    });

    it('partial config is applied when loaded by path', () => {
        configResolver = new ConfigResolver([ARGV_OPTION_NAME, 'some-path'], (): null => null, <JsonReader> {
            loadByPath: (): Partial<MplConfig> => {
                return {autoClose: false};
            }
        });

        assert.deepEqual(configResolver.getConfig(), {
            browserOptions: {
                headless: true,
                ignoreHTTPSErrors: true     ,
                timeout: 30000
            },
            autoClose: false,
            keepAlive: 0
        });
    });

    it('partial config is applied when loaded by path', () => {
        configResolver = new ConfigResolver([], (): string => 'some-string', <JsonReader> {
            loadByPath: (): Partial<MplConfig> => {
                return {
                    browserOptions: {
                        headless: false,
                        ignoreHTTPSErrors: true  ,
                        timeout: 30000
                    }
                };
            }
        });

        assert.deepEqual(configResolver.getConfig(), {
            browserOptions: {
                headless: false,
                ignoreHTTPSErrors: true,
                timeout: 30000
            },
            autoClose: true,
            keepAlive: 0
        });
    });
});
