"use strict";
import * as vscode from "vscode";
import { LANGUAGE_ID } from "../../cfmlMain";
import { ICommand } from "./ICommand";
import { ScriptContext } from "../../parser/ScriptContext";

export class LineCommentCommand implements ICommand {
    execute() {
        let editor = vscode.window.activeTextEditor;
        let context = new ScriptContext(editor.document);
        let line = editor.document.lineAt(editor.selection.start.line);
        let position = line.range.end;

        // first we should check if current selection starts with </cfscript> or </script>.
        // in this case we should start checking context after </cfscript> tag.
        // the same is applicable for <cfscript> and <script> tags.
        if (/[\s\t]*<\/[c]?[f]?script>/ig.test(line.text)) {
            position = line.range.end;
        } else if (/[\s\t]*<[c]?[f]?script>/ig.test(line.text)) {
            position = line.range.start;
        }


        let executeCommand = true;
        let command = "editor.action.commentLine";
        let config: vscode.LanguageConfiguration = {
            comments: {
                lineComment: "//"
            }
        };

        if (context.isCFQuery(position)) {
            // this is cfquery
            config = {
                comments: {
                    lineComment: "--"
                }
            };
        } else if (!context.isScript(position)) {
            // it is not a cfquery or cfscript or script tag
            // apply cfml comment manually
            executeCommand = false;
            editor.edit((builder: vscode.TextEditorEdit) => {
                let range = line.range;
                builder.insert(range.start, "<!--- ");
                builder.insert(range.end, " --->");
            });
        }

        if (executeCommand) {
            vscode.languages.setLanguageConfiguration(LANGUAGE_ID, config);
            vscode.commands.executeCommand(command);
        }
    }
}