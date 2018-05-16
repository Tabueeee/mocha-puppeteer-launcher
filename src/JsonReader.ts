import * as fs from 'fs';
import {MplConfig} from './interfaces/MplConfig';

export class JsonReader {

    public loadByPath(filePath: string): Partial<MplConfig> {
        let config: Partial<MplConfig> = {};
        let content: string = fs.readFileSync(filePath).toString();
        config = <MplConfig> JSON.parse(content);

        return config;
    }
}
