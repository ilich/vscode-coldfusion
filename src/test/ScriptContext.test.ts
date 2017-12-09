import * as assert from "assert";
import * as path from "path";
import * as vscode from "vscode";
import { ScriptContext } from "../parser/ScriptContext";

const CFML_FILE = path.join(__dirname, "../../resources/test/ScriptContext/cfml_test.cfc");
const CFML_SCRIPT = path.join(__dirname, "../../resources/test/ScriptContext/cfscript_test.cfc");

suite("ScriptContext Tests", () => {
    test("CFC with CFML", async () => {
        const document = await vscode.workspace.openTextDocument(CFML_FILE);
        const context = new ScriptContext(document);
        const position = new vscode.Position(24, 11);
        const isCFQuery = context.isCFQuery(position);
        const isCFScript = context.isScript(position);
        assert.strictEqual(isCFQuery, false);
        assert.strictEqual(isCFScript, false);
    });

    test("CFC with CFScript", async () => {
        const document = await vscode.workspace.openTextDocument(CFML_SCRIPT);
        const context = new ScriptContext(document);
        const position = new vscode.Position(11, 11);
        const isCFQuery = context.isCFQuery(position);
        const isCFScript = context.isScript(position);
        assert.strictEqual(isCFQuery, false);
        assert.strictEqual(isCFScript, true);
    });

    test("CFScript in CFML", async () => {
        const document = await vscode.workspace.openTextDocument(CFML_FILE);
        const context = new ScriptContext(document);
        const position = new vscode.Position(18, 18);
        const isCFQuery = context.isCFQuery(position);
        const isCFScript = context.isScript(position);
        assert.strictEqual(isCFQuery, false);
        assert.strictEqual(isCFScript, true);
    });

    test("CFQuery in CFML", async () => {
        const document = await vscode.workspace.openTextDocument(CFML_FILE);
        const context = new ScriptContext(document);
        const position = new vscode.Position(28, 21);
        const isCFQuery = context.isCFQuery(position);
        const isCFScript = context.isScript(position);
        assert.strictEqual(isCFQuery, true);
        assert.strictEqual(isCFScript, false);
    });
});
