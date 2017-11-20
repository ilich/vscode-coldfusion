'use strict';
import * as vscode from 'vscode';
import { LineCommentCommand } from './editor/commands/LineCommentCommand';
import { BlockCommentCommand } from './editor/commands/BlockCommentCommand';

function activateCommentsSupport(context: vscode.ExtensionContext) {
    let lineComment = new LineCommentCommand();
    let toggleLineCommentCommand = vscode.commands.registerCommand(
        'cfml.toggleLineComment', 
        lineComment.execute);
    context.subscriptions.push(toggleLineCommentCommand);

    let blockComment = new BlockCommentCommand();
    let toggleBlockCommentCommand = vscode.commands.registerCommand(
        'cfml.toggleBlockComment',
        blockComment.execute);
    context.subscriptions.push(toggleBlockCommentCommand);
}

export function activate(context: vscode.ExtensionContext) {
    activateCommentsSupport(context);
}

export function deactivate() {
}