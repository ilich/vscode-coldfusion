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
                    else {
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
    })

    grunt.registerTask('build-snippets', function() {
        grunt.task.requires('parse-cfdocs');
        grunt.log.write('TODO...');
    });

    grunt.registerTask('get-tags', function() {
        grunt.task.requires('parse-cfdocs');
        let regexp = cfdocs.tags.map(function (doc) {
            return doc.name;
        }).join('|');

        regexp = `&lt;/?((?i:${regexp})\\b)`;

        console.log(regexp);
        fs.writeFileSync('./get-tags.tmp', regexp, 'utf8');
    });

    grunt.registerTask('default', ['parse-cfdocs', 'get-tags']);

};