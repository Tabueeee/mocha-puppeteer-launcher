import * as assert from 'assert';
import {ReferenceResolver} from '../../src/ReferenceResolver';

describe('ReferenceResolver', () => {

    let referenceResolver: ReferenceResolver;
    let someFake: any = {some: 'prop'};
    let someFake2: any = {some: 'prop1'};

    it('returns first reference found', () => {
        referenceResolver = new ReferenceResolver([() => someFake, () => someFake2]);
        let reference: undefined | any;
        try {
            reference = referenceResolver.getReference('any');
        } catch (error) {

        }

        assert.deepStrictEqual(reference, someFake);
    });

    it('returns second reference', () => {
        referenceResolver = new ReferenceResolver([() => undefined, () => someFake2]);
        let reference: undefined | any;
        try {
            reference = referenceResolver.getReference('any');
        } catch (error) {

        }

        assert.deepStrictEqual(reference, someFake2);
    });

    it('throws an expection if no reference is found', () => {
        referenceResolver = new ReferenceResolver([() => undefined, () => undefined]);

        assert.throws(() => {
            referenceResolver.getReference('any');
        });
    });
});
