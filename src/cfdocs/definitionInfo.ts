import * as fs from 'fs';
import * as path from 'path';
import { extensionContext } from "../extension";

export class DefinitionInfo {
    private static allFunctionNames: string[];
    private static allTagNames: string[];

    public name: string;
    public type: string;
    public syntax: string;
    public member?: string;
    public script?: string;
    public returnType?: string;
    public related?: string[];
    public description?: string;
    public discouraged?: string;
    public params?: Param[];
    public links?: string[];
    public examples?: Example[];

    constructor(
        name: string, type: string, syntax: string, member: string, script: string, returns: string, related: string[],
        description: string, discouraged: string, params: Param[], links: string[], examples: Example[]
    )
    {
        this.name = name;
        this.type = type;
        this.syntax = syntax;
        this.member = member;
        this.script = script;
        this.returnType = returns;
        this.related = related;
        this.description = description;
        this.discouraged = discouraged;
        this.params = params;
        this.links = links;
        this.examples = examples;
    }

    public static getAllFunctionNames(): string[] {
        if (DefinitionInfo.allFunctionNames) {
            return DefinitionInfo.allFunctionNames;
        }
        const extensionPath = extensionContext.asAbsolutePath("./src/cfdocs/data/en");
        let docFilePath = path.join(extensionPath, "all.json");
        let jsonDoc = JSON.parse(fs.readFileSync(docFilePath, "utf8"));

        return jsonDoc.related;
    }

    public static getAllTagNames(): string[] {
        if (DefinitionInfo.allTagNames) {
            return DefinitionInfo.allTagNames;
        }
        const extensionPath = extensionContext.asAbsolutePath("./src/cfdocs/data/en");
        let docFilePath = path.join(extensionPath, "tags.json");
        let jsonDoc = JSON.parse(fs.readFileSync(docFilePath, "utf8"));

        return jsonDoc.related;
    }

    public static isFunctionName(name: string): boolean {
        return (DefinitionInfo.getAllFunctionNames().indexOf(name.toLowerCase()) !== -1);
    }

    public static isTagName(name: string): boolean {
        return (DefinitionInfo.getAllTagNames().indexOf(name.toLowerCase()) !== -1);
    }

    public static isSymbol(name: string): boolean {
        return (DefinitionInfo.isFunctionName(name) || DefinitionInfo.isTagName(name));
    }

    public isFunction(): boolean {
        return (this.type.toLowerCase() === "function");
    }

    public isTag(): boolean {
        return (this.type.toLowerCase() === "tag");
    }
}

export interface Param {
    name: string;
    description: string;
    required: boolean;
    default?: string;
    type: string;
    values?: string[];
}

interface Example {
    title: string;
    description: string;
    code: string;
    result: string;
    runnable?: boolean;
}
