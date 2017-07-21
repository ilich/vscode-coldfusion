'use strict';

import {
    commands, window, languages, Selection, TextEditor, TextEditorEdit, TextDocument,
    ExtensionContext, Disposable, Hover, Position, CancellationToken
} from 'vscode';
import { CfmlHoverProvider } from "./cfmlHoverProvider";

/**
 * Wraps or unwraps selected text with given before and after text.
 *
 * @param editor The text editor with selection.
 * @param insertBefore Text to insert before selection.
 * @param insertAfter Text to insert after selection.
 */
function wrapUnwrap(editor: TextEditor, insertBefore: string, insertAfter: string): void {
    const newSelections: Selection[] = [];
    const beforeLen = insertBefore.length;
    const afterLen = insertAfter.length;

    editor.edit((editBuilder: TextEditorEdit) => {
        editor.selections.forEach((selection: Selection) => {
            const selectedText = editor.document.getText(selection);
            const selectedTextLen = selectedText.length;
            const afterLenAdjust = (selection.start.line === selection.end.line) ? afterLen : (afterLen-beforeLen);
            if (selectedText.indexOf(insertBefore) === 0 && selectedText.indexOf(insertAfter) === (selectedTextLen - afterLen)) {
                editBuilder.replace(selection, selectedText.substring(beforeLen, selectedTextLen - afterLen));
                newSelections.push(new Selection(selection.start.translate(0, 0), selection.end.translate(0, -beforeLen - afterLenAdjust)));
            } else {
                editBuilder.insert(selection.start, insertBefore);
                editBuilder.insert(selection.end, insertAfter);
                if (selection.start.isEqual(selection.end)) {
                    newSelections.push(new Selection(selection.start.translate(0, beforeLen), selection.end.translate(0, afterLenAdjust + (beforeLen-afterLen))));
                } else {
                    newSelections.push(new Selection(selection.start.translate(0, 0), selection.end.translate(0, beforeLen + afterLenAdjust)));
                }
            }
        });
    }).then(() => {
        editor.selections = newSelections;
    });
}

export let extensionContext: ExtensionContext;

/**
 * This method is called when the extension is activated.
 *
 * @param context The context object for this extension.
 */
export function activate(context: ExtensionContext): void {

    extensionContext = context;

    context.subscriptions.push(commands.registerCommand('coldfusion.wrapCfmlCommentTags', () => {
        let editor: TextEditor = window.activeTextEditor;
        if (editor) {
            wrapUnwrap(editor, '<!--- ', ' --->');
        }
    }));

    context.subscriptions.push(languages.registerHoverProvider('lang-cfml', new CfmlHoverProvider()));
}

/**
 * This method is called when the extension is deactivated.
 */
export function deactivate(): void {
}

