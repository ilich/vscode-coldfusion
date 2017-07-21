import { DefinitionInfo } from "./definitionInfo";
import * as fs from 'fs';

export class CFDocsService {
    static getDefinitionInfo(symbol: string, filePath: string): DefinitionInfo {
        // TODO: Attempt to retrieve from web first

        let jsonDoc = JSON.parse(fs.readFileSync(filePath, "utf8"));

        let definitionInfo: DefinitionInfo = new DefinitionInfo(
            jsonDoc.name, jsonDoc.type, jsonDoc.syntax, jsonDoc.member, jsonDoc.script, jsonDoc.returns,
            jsonDoc.related, jsonDoc.description, jsonDoc.discouraged, jsonDoc.params, jsonDoc.links, jsonDoc.examples
        );

        return definitionInfo;
    }
}
