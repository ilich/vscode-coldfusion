"use strict";
import * as fs from "fs";
import * as path from "path";

export interface ISnippet {
    prefix: string;
    body: string;
    documentation: string;
}

export interface ICfmlSnippets {
    tags: ISnippet[];
    functions: ISnippet[];
}

export class CfmlSnippetsDataSource {
    public getSnippets(): Promise<ICfmlSnippets> {
        return new Promise<ICfmlSnippets>((resolve, reject) => {
            const result = {
                tags: null,
                functions: null,
            };

            const functionsFile = path.join(__dirname, "../../resources/snippets/functions.json");
            const tagsFile = path.join(__dirname, "../../resources/snippets/tags.json");
            fs.readFile(functionsFile, "utf8", (err, data) => {
                if (err) {
                    return resolve(result);
                }

                result.functions = JSON.parse(data);
                // tslint:disable-next-line:no-shadowed-variable
                fs.readFile(tagsFile, "utf8", (err, data) => {
                    if (err) {
                        return resolve(result);
                    }

                    result.tags = JSON.parse(data);
                    return resolve(result);
                });
            });
        });
    }
}
