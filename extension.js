const vscode = require('vscode');

/**
 * Determine code context on ColdFusion files to determine whether to use
 * tag-style comments or cfscript-style comments.
 * 
 * Uses a simple regex to determine if cf tags are present, and if so
 * whether the selection is within a cfscript tag.
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    'extension.cfml-comment-tags',
    function() {
      var editor = vscode.window.activeTextEditor;

      // define cfscript config
      // taken from ./cfscript.configuration.json
      let languageConfig = {
        comments: {
          lineComment: '//',
          blockComment: ['/*', '*/']
        },
        brackets: [['{', '}'], ['[', ']'], ['(', ')']],
        autoClosingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '#', close: '#' },
          { open: "'", close: "'", notIn: ['string', 'comment'] },
          { open: '"', close: '"', notIn: ['string'] },
          { open: '/**', close: ' */', notIn: ['string'] }
        ],
        surroundingPairs: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')'],
          ["'", "'"],
          ['#', '#'],
          ['"', '"']
        ]
      };

      if (editor != undefined) {
        const selection = editor.selection;
        const textBeforeSelection = editor.document.getText(
          new vscode.Range(new vscode.Position(0, 0), selection.start)
        );
        const fullSelectionText = editor.document.getText(
          new vscode.Range(
            new vscode.Position(editor.selection.start.line, 0),
            editor.document.lineAt(editor.selection.end).range.end
          )
        );

        // if no <cf> tags, assume cfscript
        // if text is within a <cfscript> tag, default to cfscript comments
        if (
          // <cf tag exists, and
          textBeforeSelection.search(/\<cf/) !== -1 &&
          // selection contains "<cfscript or </cfscript", or
          (fullSelectionText.search(/<\/?cfscript/) !== -1 ||
            // the last instance of <cf or </cf is not <cfscript.
            // (If the last instance is cfscript, it means we are within a cfscript tag
            // and should use cfscript comments.)
            textBeforeSelection
              .match(/\<\/?cf(?!.*\<\/?cf).{0,6}/g)
              .reverse()[0] !== '<cfscript')
        ) {
          languageConfig = Object.assign(languageConfig, {
            comments: {
              blockComment: ['<!---', '--->']
            }
          });
        }
        // set language config, which should enable the right kind of comments
        vscode.languages.setLanguageConfiguration('lang-cfml', languageConfig);
        vscode.commands.executeCommand('editor.action.commentLine');
      }
    }
  );
}
exports.activate = activate;

exports.deactivate = function() {};
