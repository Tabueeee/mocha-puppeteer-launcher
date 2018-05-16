import {Options} from 'find-up';
import {Const} from './Const';
import {MplConfig} from './interfaces/MplConfig';
import {JsonReader} from './JsonReader';
import ARGV_OPTION_NAME = Const.ARGV_OPTION_NAME;
import OPTION_FILE_NAME = Const.OPTION_FILE_NAME;

export class ConfigResolver {
    private config: MplConfig;
    private findUpSync: (filename: (string | Array<string>), options?: Options) => (string | null);
    private argv: Array<string>;
    private fileReader: JsonReader;
    private readonly defaultConfig: MplConfig = {
        browserOptions: {
            headless: true,
            ignoreHTTPSErrors: true,
            timeout: 30000
        },
        autoClose: true,
        keepAlive: 0
    };

    constructor(argv: Array<string>,
                findUpSync: (filename: string | Array<string>, options?: Options) => string | null,
                fileReader: JsonReader) {
        this.findUpSync = findUpSync;
        this.argv = argv;
        this.fileReader = fileReader;
        this.config = this.defaultConfig;
        this.loadConfig();
    }

    public getConfig(): MplConfig {
        return this.config;
    }

    public loadConfig(): void {
        let index: number = this.argv.indexOf(ARGV_OPTION_NAME);

        if (index > -1 && typeof this.argv[index + 1] === 'string') {
            Object.assign(this.config, this.fileReader.loadByPath(this.argv[index + 1]));
        } else {
            this.autoLoad();
        }
    }

    private autoLoad(): void {
        let filePath: string | null = this.findUpSync(OPTION_FILE_NAME, {cwd: process.cwd()});
        if (typeof filePath === 'string') {

            Object.assign(this.config, this.fileReader.loadByPath(filePath));
        }
    }
}
