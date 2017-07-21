import {
    Hover, HoverProvider, Position, Range, TextDocument, CancellationToken, MarkedString, ExtensionContext
} from "vscode";
import { CFDocsService } from "./cfdocs/cfDocsService";
import { DefinitionInfo, Param } from "./cfdocs/definitionInfo";
import { extensionContext } from "./extension";
import * as path from 'path';
import * as fs from 'fs';

const escape = require('markdown-escape');

const isDebug = false;
const cfDocsLinkPrefix = "https://cfdocs.org/";

export class CfmlHoverProvider implements HoverProvider {
    /**
     *
     *
     * @param document The document in which the hover was invoked.
     * @param position The position at which the hover was invoked.
     * @return A Promise for list of MarkedStrings that constitute hover text
     */
    getFormattedStrings(document: TextDocument, position: Position): Promise<MarkedString[]> {
        const extensionPath: string = extensionContext.asAbsolutePath("./src/cfdocs/data/en");
        const wordRange: Range = document.getWordRangeAtPosition(position);
        const lineText: string = document.lineAt(position.line).text;
        const word: string = wordRange ? document.getText(wordRange) : "";

        if (isDebug) {
            console.log(wordRange);
            console.log(lineText);
            console.log(word);
        }

        if (!wordRange) {
            return Promise.resolve(null);
        }

        if (!DefinitionInfo.isSymbol(word)) {
            return Promise.resolve(null);
        }

        const docFilePath = path.join(extensionPath, word.toLowerCase() + ".json");
        if (isDebug) {
            console.log(docFilePath);
        }

        if (!fs.existsSync(docFilePath)) {
            return Promise.resolve(null);
        }

        return new Promise<MarkedString[]>((resolve, reject) => {
            const definition: DefinitionInfo = CFDocsService.getDefinitionInfo(word, docFilePath);

            if (!definition.name) {
                return reject("Invalid definition format");
            }

            let hoverTexts: MarkedString[] = this.createHoverText(definition);

            return resolve(hoverTexts);
        });
    }

    /**
     * Creates a list of MarkedString that becomes the hover text based on the symbol definition
     *
     * @param definition The symbol definition information
     * @return Array of MarkedString that makes up hover text
     */
    public createHoverText(definition: DefinitionInfo): MarkedString[] {
        let hoverTexts: MarkedString[] = [];

        const returnType = definition.returnType;
        let syntax = definition.syntax;
        if (returnType && returnType.length) {
            syntax += ": " + returnType;
        }

        const symbolType = definition.type;
        let language = "";
        let paramType = "";
        if (definition.isFunction()) {
            language = "typescript";
            paramType = "Argument";
        } else {
            language = "lang-cfml";
            paramType = "Attribute";
        }

        hoverTexts.push({ language, value: syntax });

        if (definition.description) {
            hoverTexts.push(escape(definition.description));
        } else {
            hoverTexts.push("_No " + symbolType.toLowerCase() + " description_");
        }

        let paramList: Param[] = definition.params;
        if (paramList.length > 0) {
            hoverTexts.push("**" + paramType + " Reference**");
        }

        for (const param of paramList) {
            let paramString = param.name;
            if (param.type && param.type.length) {
                paramString += ": " + param.type;
            }
            hoverTexts.push({ language: 'typescript', value: paramString });

            if (param.description) {
                hoverTexts.push(param.description);
            } else {
                hoverTexts.push("_No " + paramType.toLowerCase() + " description_");
            }
        }

        hoverTexts.push("Link: " + cfDocsLinkPrefix + definition.name);

        return hoverTexts;
    }

    /**
     * Provides a hover for the given position and document
     *
     * @param document The document in which the hover was invoked.
     * @param position The position at which the hover was invoked.
     * @param token A cancellation token.
     * @return A hover or a thenable that resolves to such.
     */
    public provideHover(document: TextDocument, position: Position, token: CancellationToken): Thenable<Hover> {
        return this.getFormattedStrings(document, position).then((formattedStrings: MarkedString[]) => {
            let hover = new Hover(formattedStrings);
            return hover;
        }, () => {
            return null;
        });
    }
}