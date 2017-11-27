import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import { ScriptContext } from '../parser/ScriptContext';

const CFML_FILE = path.join(__dirname, '../../resources/test/ScriptContext/cfml_test.cfc');
const CFML_SCRIPT = path.join(__dirname, '../../resources/test/ScriptContext/cfscript_test.cfc');

suite('ScriptContext Tests', () => {
    test('CFC with CFML', async () => {
        let document = await vscode.workspace.openTextDocument(CFML_FILE);
        let context = new ScriptContext(document);
        let position = new vscode.Position(24, 11);
        let isCFQuery = context.isCFQuery(position);
        let isCFScript = context.isScript(position);
        assert.strictEqual(isCFQuery, false);
        assert.strictEqual(isCFScript, false);
    });

    test('CFC with CFScript', async () => {
        let document = await vscode.workspace.openTextDocument(CFML_SCRIPT);
        let context = new ScriptContext(document);
        let position = new vscode.Position(11, 11);
        let isCFQuery = context.isCFQuery(position);
        let isCFScript = context.isScript(position);
        assert.strictEqual(isCFQuery, false);
        assert.strictEqual(isCFScript, true);
    });

    test('CFScript in CFML', async () => {
        let document = await vscode.workspace.openTextDocument(CFML_FILE);
        let context = new ScriptContext(document);
        let position = new vscode.Position(18, 18);
        let isCFQuery = context.isCFQuery(position);
        let isCFScript = context.isScript(position);
        assert.strictEqual(isCFQuery, false);
        assert.strictEqual(isCFScript, true);
    });

    test('CFQuery in CFML', async () => {
        let document = await vscode.workspace.openTextDocument(CFML_FILE);
        let context = new ScriptContext(document);
        let position = new vscode.Position(28, 21);
        let isCFQuery = context.isCFQuery(position);
        let isCFScript = context.isScript(position);
        assert.strictEqual(isCFQuery, true);
        assert.strictEqual(isCFScript, false);
    });
});