'use strict';
import * as vscode from 'vscode';
import { ICommand } from './ICommand';

export class BlockCommentCommand implements ICommand {
    execute() {
        vscode.window.showInformationMessage('Block Comment');
    }
}