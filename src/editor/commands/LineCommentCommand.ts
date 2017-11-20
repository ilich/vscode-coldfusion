'use strict';
import * as vscode from 'vscode';
import { ICommand } from './ICommand';

export class LineCommentCommand implements ICommand {
    execute() {
        vscode.window.showInformationMessage('Line Comment');
    }
}