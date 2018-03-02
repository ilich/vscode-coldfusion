let fs = require('fs');
let path = require('path');
let jsonFormat = require('json-format');

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
            let doc = `${item.description}\n\n**USAGE:**\n*${item.returns} ${item.name}(`;
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

                let paramHelp = `*${param.name} (${param.type})*`;
                if (param.description && param.description.length > 0) {
                    paramHelp += ` - ${param.description}`;
                }

                if (param.default) {
                    paramHelp += `. **Default:** *${param.default}*.`;
                }

                if (param.values && param.values.length > 0) {
                    paramHelp += ' **Values:** *' + param.values.join(', ') + '*.';
                }

                docParams.push(paramHelp + '\n');
            }

            code += ')';
            doc += ')*';
            doc += '\n\n**PARAMETERS:**\n\n';
            doc += docParams.join('\n');

            snippet.body = code;
            snippet.documentation = doc;
            return snippet;
        }

        const closedTags = [
            'cfoutput', 
            'cfquery', 
            'cfif', 
            'cfscript',
            'cffunction',
            'cfcomponent',
            'cfmail',
            'cfsavecontent'
        ];

        const excludedTags = [
            'cfswitch',
            'cfloop',
            'cftry',
            'cfset'
        ];

        function createTagSnippet(item) {
            let snippet = {
                prefix: item.name
            };

            let code = `<${item.name}`;
            let doc = `${item.description}\n\n**USAGE:**\n*<${item.name}`;
            let docParams = [];
            let codeCounter = 1;

            for (let i = 0; item.params && i < item.params.length; i++) {
                let param = item.params[i];
                
                if (param.required) {
                    doc += ' ';
                    code += ' ';

                    doc += param.name + '=""';
                    
                    if (param.values && param.values.length > 0) {
                        let values = param.values.join(',');
                        code += `${param.name}="\${${codeCounter}|${values}|}"`;
                    }
                    else {
                        code += `${param.name}="\${${codeCounter}:${param.name}}"`;
                    }
                    
                    codeCounter++;
                }
                else {
                    doc += ` [${param.name}=""]`;
                }

                let paramHelp = `*${param.name} (${param.type})*`;
                if (param.description && param.description.length > 0) {
                    paramHelp += ` - ${param.description}`;
                }

                if (param.default) {
                    paramHelp += `. **Default:** *${param.default}*.`;
                }

                if (param.values && param.values.length > 0) {
                    paramHelp += ' **Values:** *' + param.values.join(', ') + '*.';
                }

                docParams.push(paramHelp + '\n');
            }

            if (closedTags.indexOf(item.name) > -1) {
                code += `>\n</${item.name}>`;
                doc += `></${item.name}>*`;
            } else {
                code += '>';
                doc += '>*';
            }
            
            doc += '\n\n**PARAMETERS:**\n\n';
            doc += docParams.join('\n');

            snippet.body = code;
            snippet.documentation = doc;
            return snippet;
        }

        grunt.task.requires('parse-cfdocs');

        // prepare function snippets

        let jsonFormatOptions = {
            type: 'space',
            space: {
                size: 4
            }
        };

        let snippets = [];
        for (let func of cfdocs.functions) {
            let snippet = createFunctionSnippet(func);
            snippets.push(snippet);
        }

        fs.writeFileSync('./resources/snippets/functions.json', jsonFormat(snippets, jsonFormatOptions), 'utf8');

        // prepare tag snippets

        snippets = [];
        for (let tag of cfdocs.tags) {
            if (excludedTags.indexOf(tag.name) > -1) {
                continue;
            }
            
            let snippet = createTagSnippet(tag);
            snippets.push(snippet);
        }

        fs.writeFileSync('./resources/snippets/tags.json', jsonFormat(snippets, jsonFormatOptions), 'utf8');
    });

    grunt.registerTask('get-tags', function() {
        // create regular expression to parse CFML tags

        grunt.task.requires('parse-cfdocs');
        let regexp = cfdocs.tags.map(function (doc) {
            return doc.name;
        }).join('|');

        console.log(regexp);
        fs.writeFileSync('./get-tags.tmp', regexp, 'utf8');
    });

    grunt.registerTask('default', ['parse-cfdocs', 'build-snippets']);

};