"use strict";
import * as vscode from "vscode";
import { BlockCommentCommand } from "./editor/commands/BlockCommentCommand";
import { LineCommentCommand } from "./editor/commands/LineCommentCommand";
import { CfmlSnippetsCompletionProvider } from "./editor/providers/CfmlSnippetsCompletionProvider";

export const LANGUAGE_ID = "cfml";

function isEnabled(paramName: string, defaultValue: boolean = true): boolean {
    let enabled: boolean;
    const config = vscode.workspace.getConfiguration("cfml");
    if (config === null) {
        enabled = defaultValue;
    } else {
        enabled = config.get(paramName);
    }

    return enabled;
}

function activateCommentsSupport(context: vscode.ExtensionContext) {
    const lineComment = new LineCommentCommand();
    const toggleLineCommentCommand = vscode.commands.registerCommand(
        "cfml.toggleLineComment",
        lineComment.execute);
    context.subscriptions.push(toggleLineCommentCommand);

    const blockComment = new BlockCommentCommand();
    const toggleBlockCommentCommand = vscode.commands.registerCommand(
        "cfml.toggleBlockComment",
        blockComment.execute);
    context.subscriptions.push(toggleBlockCommentCommand);
}

function activateSnippets(context: vscode.ExtensionContext) {
    if (!isEnabled("snippets.enabled")) {
        return;
    }

    const snippetsProvider = new CfmlSnippetsCompletionProvider();
    const provider = vscode.languages.registerCompletionItemProvider(LANGUAGE_ID, snippetsProvider);
    context.subscriptions.push(provider);
}

export function activate(context: vscode.ExtensionContext) {
    activateCommentsSupport(context);
    activateSnippets(context);
}

export function deactivate() {
    // TBD. It is not used at the moment.
}
