let fs = require('fs');
let path = require('path');

module.exports = function(grunt) {

    function parseCfDocs(repo) {
        return new Promise(function (resolve, reject) {
            let docs = path.join(repo, 'data/en/');
            if (!fs.existsSync(docs)) {
                reject(`CFDocs repository is not found at ${docs}. Git repository: https://github.com/foundeo/cfdocs/.`);
            }
            else {
                files = fs.readdirSync(docs);
                let result = {
                    tags: [],
                    functions: []
                };

                for (let file of files) {
                    if (path.extname(file) !== '.json') {
                        continue;
                    }

                    console.log(`Parsing ${file}`);
                    let filename = path.join(docs, file);
                    let content = fs.readFileSync(filename, 'utf8');
                    let doc = JSON.parse(content);
                    if (doc.type === 'tag') {
                        result.tags.push(doc);
                    }
                    else if (doc.type === 'function') {
                        result.functions.push(doc);
                    }
                }

                resolve(result);
            }
        });
    }
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    });

    let cfdocs = null;
    grunt.registerTask('parse-cfdocs', function() {
        if (cfdocs !== null) {
            // parse the documentation just once for all tasks
            return;
        }

        var done = this.async();
        parseCfDocs('../cfdocs')
            .then(function (docs) {
                cfdocs = docs;
                done();
            })
            .catch(function (error) {
                grunt.fatal(error);
            });
    });

    grunt.registerTask('build-snippets', function() {
        function createFunctionSnippet(item) {
            let snippet = {
                prefix: item.name
            };

            let code = `${item.name}(`;
            let doc = `${item.description}\n\nUSAGE:\n${item.returns} ${item.name}(`;
            let docParams = [];
            let codeCounter = 1;

            for (let i = 0; item.params && i < item.params.length; i++) {
                let param = item.params[i];
                
                if (param.required) {
                    if (i > 0) {
                        doc += ', ';
                        code += ', ';
                    }

                    doc += param.name;
                    
                    if (param.values && param.values.length > 0) {
                        let values = param.values.join(',');
                        code += `\${${codeCounter}|${values}|}`;
                    }
                    else {
                        code += `\${${codeCounter}:${param.name}}`;
                    }
                    
                    codeCounter++;
                }
                else {
                    doc += ' [';
                    if (i > 0) {
                        doc += ', ';
                    }
                    
                    doc += `${param.name}]`;
                }

                let paramHelp = `${param.name} (${param.type})`;
                if (param.description && param.description.length > 0) {
                    paramHelp += ` - ${param.description}`;
                }

                if (param.default) {
                    paramHelp += `. Default: ${param.default}.`;
                }

                if (param.values && param.values.length > 0) {
                    paramHelp += ' Values: ' + param.values.join(', ') + '.';
                }

                docParams.push(paramHelp + '\n');
            }

            code += ')';
            doc += ')';
            doc += '\n\nPARAMETERS:\n\n';
            doc += docParams.join('\n');

            snippet.body = code;
            snippet.description = doc;
            snippet.scope = 'text.html.cfm';
            return snippet;
        }

        grunt.task.requires('parse-cfdocs');
        let snippets = [];
        for (let func of cfdocs.functions) {
            let snippet = createFunctionSnippet(func);
            snippets.push(snippet);
        }

        fs.writeFileSync('./build-snippets.tmp', JSON.stringify(snippets), 'utf8');
        console.log(snippets);
    });

    grunt.registerTask('get-tags', function() {
        // create regular expression to parse CFML tags

        grunt.task.requires('parse-cfdocs');
        let regexp = cfdocs.tags.map(function (doc) {
            return doc.name;
        }).join('|');

        regexp = `&lt;/?((?i:${regexp})\\b)`;

        console.log(regexp);
        fs.writeFileSync('./get-tags.tmp', regexp, 'utf8');
    });

    grunt.registerTask('get-ops', function () {
        // create regular expression to parse CFML operators

        let ops = ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'not', 'is', 'imp', 'eqv', 'contains', 'mod', 'and', 'or'];
        let result = ops.join('|');;
        result = `\\b((?i:${result})\\b`;

        console.log(result);
        fs.writeFileSync('./get-ops.tmp', result, 'utf8');
    });

    grunt.registerTask('default', ['parse-cfdocs', 'build-snippets']);

};