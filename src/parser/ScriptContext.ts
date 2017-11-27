import * as vscode from 'vscode';

export class ScriptContext {
    private document: vscode.TextDocument;
    private cfqueryBegin = new RegExp('<cfquery', 'ig');
    private cfqueryEnd = new RegExp('<\/cfquery', 'ig');
    private cfscriptBegin = new RegExp('<cfscript', 'ig');
    private cfscriptEnd = new RegExp('<\/cfscript', 'ig');
    private scriptBegin = new RegExp('<script', 'ig');
    private scriptEnd = new RegExp('<\/script', 'ig');
    private anyCfml = new RegExp('<cf', 'ig');

    constructor(document: vscode.TextDocument) {
        this.document = document;
    }

    public isScript(position: vscode.Position) {
        let text = this.document.getText();
        if (!text.match(this.anyCfml)) {
            return true;
        }

        let range = new vscode.Range(new vscode.Position(0, 0), position);
        text = this.document.getText(range);
        let result = this.isBetweenTags(text, this.cfscriptBegin, this.cfscriptEnd);
        if (!result) {
            // check. it might be JavaScript tag.
            result = this.isBetweenTags(text, this.scriptBegin, this.scriptEnd);
        }

        return result;
    }

    public isCFQuery(position: vscode.Position) {
        let range = new vscode.Range(new vscode.Position(0, 0), position);
        let text = this.document.getText(range);
        let result = this.isBetweenTags(text, this.cfqueryBegin, this.cfqueryEnd);
        return result;
    }

    private isBetweenTags(text: string, start: RegExp, end: RegExp) {
        let lastBegin = -1;
        let lastEnd = -1;
        let match: RegExpExecArray;

        while((match = start.exec(text)) !== null) {
            lastBegin = match.index;
        }

        while((match = end.exec(text)) !== null) {
            lastEnd = match.index;
        }

        return lastBegin > lastEnd;
    }
}