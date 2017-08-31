// https://github.com/trstt/cfml-comment-tags

// or, could just try to merge with This
// https://github.com/ilich/vscode-coldfusion

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    'extension.cfml-comment-tags',
    function() {
      // The code you place here will be executed every time your command is executed
      var editor = vscode.window.activeTextEditor;

      // set cfscript config by default
      let languageConfig = {
        comments: {
          lineComment: '//',
          blockComment: ['/*', '*/']
        },
        brackets: [['{', '}'], ['[', ']'], ['(', ')']],
        autoClosingPairs: [
          {
            open: '{',
            close: '}'
          },
          {
            open: '[',
            close: ']'
          },
          {
            open: '(',
            close: ')'
          },
          {
            open: '#',
            close: '#'
          },
          {
            open: "'",
            close: "'",
            notIn: ['string', 'comment']
          },
          {
            open: '"',
            close: '"',
            notIn: ['string']
          },
          {
            open: '/**',
            close: ' */',
            notIn: ['string']
          }
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

      try {
        if (editor != undefined) {
          const selection = editor.selection;
          const textBeforeSelection = editor.document.getText(
            new vscode.Range(new vscode.Position(0, 0), selection.start)
          );
          // if no <cf> tags, assume cfscript
          // console.log(
          //   textBeforeSelection
          //   .replace(editor.document.eol === 1 ? /\n/gm : /\n\r/gm, '')
          //   .match(/\<cf(?!.*\<cf).{6}/g)[0],
          //   textBeforeSelection
          //   .replace(editor.document.eol === 1 ? /\n/gm : /\n\r/gm, '')
          //   .search(/\<\/cfscript/g)
          //   // ,textBeforeSelection.replace(editor.document.eol == 1 ? /\n/ : /\n\r/, ''),
          //   // editor.document.eol
          // );
          if (
            // <cf tag exists
            textBeforeSelection.search(/\<cf/) !== -1 &&
            // the last instance is not <cfscript
            (textBeforeSelection
              .replace(editor.document.eol === 1 ? /\n/gm : /\n\r/gm, '')
              .match(/\<cf(?!.*\<cf).{6}/g)[0] !== '<cfscript' ||
              // there is a cfscript tag above you
              textBeforeSelection
                .replace(editor.document.eol === 1 ? /\n/gm : /\n\r/gm, '')
                .search(/\<\/cfscript/g) !== -1 ||
              // selection contains "<cfscript> or </cfscript>"
              editor.document
                .getText(editor.selection.line)
                .search(/<\/?cfscript/) !== -1)
          ) {
            languageConfig = Object.assign(languageConfig, {
              comments: {
                blockComment: ['<!---', '--->']
              }
            });
          }
          // set language config, which should enable the right kind of comments
          vscode.languages.setLanguageConfiguration(
            'lang-cfml',
            languageConfig
          );
          vscode.commands.executeCommand('editor.action.commentLine');
        }
      } catch (e) {
        console.log(e);
      }
    }
  );
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
