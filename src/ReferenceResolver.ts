export class ReferenceResolver {
    private referenceLoaders: Array<(name: string) => any>;

    public constructor(referenceLoaders: Array<(name: string) => any>) {
        this.referenceLoaders = referenceLoaders;
    }

    public getReference(name: string): any {
        let reference: any;
        let index: number = 0;
        let errMsg: string = '';

        while (typeof reference === 'undefined' && typeof this.referenceLoaders[index] === 'function') {
            try {
                reference = this.referenceLoaders[index++](name);
            } catch (error) {
            }
        }

        if (typeof reference === 'undefined') {
            throw new Error(`unable to resolve ${name} error: "${errMsg}"`);
        }

        return reference;
    }
}
