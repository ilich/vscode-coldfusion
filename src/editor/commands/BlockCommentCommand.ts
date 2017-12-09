"use strict";
import * as vscode from "vscode";
import { LANGUAGE_ID } from "../../cfmlMain";
import { ScriptContext } from "../../parser/ScriptContext";
import { ICommand } from "./ICommand";

export class BlockCommentCommand implements ICommand {
    public execute() {
        const editor = vscode.window.activeTextEditor;
        const context = new ScriptContext(editor.document);

        let position = editor.selection.start;

        // first we should check if current selection starts with </cfscript>.
        // in this case we should start checking context after </cfscript> tag.
        // this is a workaround to support block comments.
        const selectedText = editor.document.getText(editor.selection);
        if (/[\s\t]*<\/[c]?[f]?script>/ig.test(selectedText)) {
            const line = editor.document.lineAt(position.line);
            position = line.range.end;
        }

        let config: vscode.LanguageConfiguration = {
            comments: {
                blockComment: [ "/*", "*/" ],
            },
        };

        if (!context.isScript(position) && !context.isCFQuery(position)) {
            config = {
                comments: {
                    blockComment: [ "<!---", "--->" ],
                },
            };
        }

        vscode.languages.setLanguageConfiguration(LANGUAGE_ID, config);
        vscode.commands.executeCommand("editor.action.blockComment");
    }
}
