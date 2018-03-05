"use strict";
import * as vscode from "vscode";
import { CfmlSnippetsDataSource, ICfmlSnippets, ISnippet } from "../../data/CfmlSnippetsDataSource";

export class CfmlSnippetsCompletionProvider implements vscode.CompletionItemProvider {
    private dataSource = new CfmlSnippetsDataSource();

    public provideCompletionItems(document: vscode.TextDocument,
                                  position: vscode.Position,
                                  token: vscode.CancellationToken,
                                  context: vscode.CompletionContext):
                                  vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        return new Promise<vscode.CompletionItem[]>((resolve, reject) => {
            this.dataSource.getSnippets().then((cfml) => {
                const completions: vscode.CompletionItem[] = [];
                if (cfml === null) {
                    resolve(completions);
                }

                if (cfml.functions !== null) {
                    for (const snippet of cfml.functions) {
                        const item = this.snippet2CompletionItem(snippet);
                        completions.push(item);
                    }
                }

                if (cfml.tags !== null) {
                    for (const snippet of cfml.tags) {
                        const item = this.snippet2CompletionItem(snippet, true, document, position);
                        completions.push(item);
                    }
                }

                return resolve(completions);
            });
        });
    }

    private snippet2CompletionItem(snippet: ISnippet,
                                   isTag: boolean = false,
                                   document?: vscode.TextDocument,
                                   position?: vscode.Position) {
        const prefix = snippet.prefix;
        const item = new vscode.CompletionItem(prefix, vscode.CompletionItemKind.Snippet);
        item.documentation = new vscode.MarkdownString(snippet.documentation);
        item.filterText = prefix.replace(/^cf/, '');

        // https://github.com/ilich/vscode-coldfusion/issues/32
        let isSnippetSet = false;
        if (isTag) {
            const currentWord = document.getWordRangeAtPosition(position);
            if (currentWord.start.character > 0) {
                const chBeforeRange = new vscode.Range(currentWord.start.line, currentWord.start.character - 1,
                    currentWord.start.line, currentWord.start.character);
                const chBefore = document.getText(chBeforeRange);
                if (chBefore === "<") {
                    item.insertText = new vscode.SnippetString(snippet.body.substr(1));
                    isSnippetSet = true;
                }
            }
        }

        if (!isSnippetSet) {
            item.insertText = new vscode.SnippetString(snippet.body);
        }

        return item;
    }
}
