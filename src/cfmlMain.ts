"use strict";
import * as vscode from "vscode";
import { BlockCommentCommand } from "./editor/commands/BlockCommentCommand";
import { LineCommentCommand } from "./editor/commands/LineCommentCommand";

export const LANGUAGE_ID = "cfml";

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

export function activate(context: vscode.ExtensionContext) {
    activateCommentsSupport(context);
}

export function deactivate() {
    // TBD. It is not used anymore.
}
