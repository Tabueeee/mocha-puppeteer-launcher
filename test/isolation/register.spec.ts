import * as assert from 'assert';
import {browserLauncher, config, register} from '../../src/index';
import sinon = require('sinon');
import {SinonSpy, SinonStub} from 'sinon';


describe('register', () => {

    before(async () => {
        sinon.stub(browserLauncher, 'start').returns(Promise.resolve({}));
        await browserLauncher.getPuppeteerLoadedPromise();
    });

    after(() => {
        (<SinonStub> browserLauncher.start).restore();
        // sinon.restore(browserLauncher.start);
    });

    it('register with after hook', () => {
        let tmp: any = process.nextTick;
        let cb: () => any;

        process.nextTick = (callback: () => any): void => {
            cb = callback;

            process.nextTick = tmp;
            assert.ok(typeof cb === 'function');
            assert.doesNotThrow(cb);
        };

        register();
    });

    it('register without after hook', () => {
        config.autoClose = false;
        let tmp: any = process.nextTick;
        let called: boolean = false;

        process.nextTick = (_callback: () => any): void => {
            called = true;
        };

        register();

        process.nextTick = tmp;
        assert.ok(called === false);
    });

    it('newPage', () => {
        assert.ok((<SinonSpy> browserLauncher.start).called);
    });

    it('newPage', () => {
        assert.ok(typeof newPage === 'function');
    });

    it('closeBrowser', () => {
        assert.ok(typeof closeBrowser === 'function');
    });
});
