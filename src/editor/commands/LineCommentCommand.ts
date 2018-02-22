"use strict";
import * as vscode from "vscode";
import { LANGUAGE_ID } from "../../cfmlMain";
import { ScriptContext } from "../../parser/ScriptContext";
import { ICommand } from "./ICommand";

export class LineCommentCommand implements ICommand {
    public execute() {
        const editor = vscode.window.activeTextEditor;
        const context = new ScriptContext(editor.document);
        const line = editor.document.lineAt(editor.selection.start.line);
        let position = line.range.end;

        // first we should check if current selection starts with </cfscript> or </script>.
        // in this case we should start checking context after </cfscript> tag.
        // the same is applicable for <cfscript> and <script> tags.
        if (/[\s\t]*<\/[c]?[f]?script>/ig.test(line.text)) {
            position = line.range.end;
        } else if (/[\s\t]*<[c]?[f]?script>/ig.test(line.text)) {
            position = line.range.start;
        }

        let config: vscode.LanguageConfiguration = {
            comments: {
                lineComment: "//",
            },
        };

        if (context.isCFQuery(position)) {
            // this is cfquery
            config = {
                comments: {
                    lineComment: "--",
                },
            };
        } else if (!context.isScript(position)) {
            // it is not a cfquery or cfscript or script tag
            config = {
                comments: {
                    blockComment: ["<!---", "--->"],
                },
            };
        }

        vscode.languages.setLanguageConfiguration(LANGUAGE_ID, config);
        vscode.commands.executeCommand("editor.action.commentLine");
    }
}
