import * as assert from 'assert';
import {MplConfig} from '../../src/interfaces/MplConfig';
import {JsonReader} from '../../src/JsonReader';

describe('JsonReader', () => {
    it('load config by valid path', async () => {
        let jr: JsonReader = new JsonReader();

        let parsedConfig: Partial<MplConfig> = jr.loadByPath(`${__dirname}/../common/mplconfigFake.json`);

        assert.deepEqual(parsedConfig, {
                browserOptions: {
                    headless: true,
                    ignoreHTTPSErrors: true
                },
                timeout: 25000
            }
        );
    });

    it('load config by invalid path', async () => {
        let jr: JsonReader = new JsonReader();
        assert.throws(() => {
                jr.loadByPath('missing.json');
            }
        );
    });
});
