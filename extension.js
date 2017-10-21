const vscode = require('vscode');
const { isTagComment } = require("./matchers");

/**
 * Get selection text for specified context
 * for line comment, we want to consider text outside of the actual comment bounds
 * for block comment, we do not want to consider text outside of the actual comment bounds
 * @param {vscode.window.activeTextEditor} editor 
 * @param {string} commentType line || block
 */
function getSelectionText(editor, commentType) {
  if (commentType === 'line') {
    return editor.document.getText(
      new vscode.Range(
        new vscode.Position(editor.selection.start.line, 0),
        editor.document.lineAt(editor.selection.end).range.end
      )
    );
  }
  return editor.document.getText(new vscode.Range(editor.selection.start, editor.selection.end));
}

// set language configuration and run specified comment command
// command should be either "commentLine" or "blockComment"
function configureAndComment(languageConfig, command) {
  // set language config, which should enable the right kind of comments
  vscode.languages.setLanguageConfiguration('lang-cfml', languageConfig);
  vscode.commands.executeCommand(`editor.action.${command}`);
}

/**
 * Return a function that can be used to execute a line or block comment
 * @param {string} commentType line || block
 */
function getCommentCommand(commentType) {
  return function() {
    var editor = vscode.window.activeTextEditor;

    // define cfscript config
    // taken from ./cfscript.configuration.json, with properties removed based on api
    // https://code.visualstudio.com/docs/extensionAPI/vscode-api#LanguageConfiguration
    let languageConfig = {
      comments: {
        lineComment: '//',
        blockComment: ['/*', '*/']
      }
      // ,brackets: [['{', '}'], ['[', ']'], ['(', ')']] // possibly not necessary
    };;

    if (editor != undefined) {
      try {

        const selection = editor.selection;
        const textBeforeSelection = editor.document.getText(
          new vscode.Range(new vscode.Position(0, 0), selection.start)
        );
        
        const selectionText = getSelectionText(editor, commentType);
  
        // if no <cf> tags, assume cfscript
        // if text is within a <cfscript> tag, default to cfscript comments
        // (If the last instance is cfscript, it means we are within a cfscript tag
        // and should use cfscript comments.)
        if (isTagComment(editor.document.getText(), textBeforeSelection, selectionText, selection.start.line)) {
          languageConfig = {
            comments: {
              blockComment: ['<!---', '--->']
            }
          };
        }
        configureAndComment(languageConfig, commentType === 'line' ? 'commentLine' : 'blockComment');
      } catch (e) {
        console.log(e)
      }
    }
  }
}

/**
 * Determine code context on ColdFusion files to determine whether to use
 * tag-style comments or cfscript-style comments.
 * 
 * Uses a simple regex to determine if cf tags are present, and if so
 * whether the selection is within a cfscript tag.
 */
function activate(context) {
  // Define comment commands
  //=============================
  vscode.commands.registerCommand('extension.cfml-line-comment', getCommentCommand('line'));
  vscode.commands.registerCommand('extension.cfml-block-comment', getCommentCommand('block'));
}
exports.activate = activate;

exports.deactivate = function() {};
