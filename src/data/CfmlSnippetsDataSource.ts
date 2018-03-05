/* tslint:disable:max-line-length */
"use strict";
import * as fs from "fs";
import * as path from "path";

const TAG_SNIPPETS: ISnippet[] = [
    {
        prefix: "cfif/cfelse",
        body: "<cfif ${1:expression}>\n<cfelse>\n</cfif>",
        documentation: "```cfml\n<cfif >\n<cfelse>\n</cfif>\n```\nCreates simple and compound conditional statements in CFML. Tests an expression, variable, function return value, or string. Used, optionally, with the cfelse and cfelseif tags.",
    },
    {
        prefix: "cfif/cfelseif/cfelse",
        body: "<cfif ${1:expression}>\n<cfelseif ${2:expression}>\n<cfelse>\n</cfif>",
        documentation: "```cfml\n<cfif expression>\n<cfelseif expression>\n<cfelse>\n</cfif>\n```\nCreates simple and compound conditional statements in CFML. Tests an expression, variable, function return value, or string. Used, optionally, with the cfelse and cfelseif tags.",
    },
    {
        prefix: "cfswitch",
        body: "<cfswitch ${1:expression}>\n<cfcase value=\"${2:value}\">\n</cfcase>\n</cfswitch>",
        documentation: "```cfml\n<cfswitch expression>\n<cfcase value=\"\">\n</cfcase>\n</cfswitch>\n```\nEvaluates a passed expression and passes control to the cfcase tag that matches the expression result. You can, optionally, code a cfdefaultcase tag, which receives control if there is no matching cfcase tag value.",
    },
    {
        prefix: "cfswitch/cfdefaultcase",
        body: "<cfswitch ${1:expression}>\n<cfcase value=\"${2:value}\">\n</cfcase>\n<cfdefaultcase>\n</cfdefaultcase>\n</cfswitch>",
        documentation: "```cfml\n<cfswitch expression>\n<cfcase value=\"\">\n</cfcase>\n<cfdefaultcase>\n</cfdefaultcase>\n</cfswitch>\n```\nEvaluates a passed expression and passes control to the cfcase tag that matches the expression result. You can, optionally, code a cfdefaultcase tag, which receives control if there is no matching cfcase tag value.",
    },
    {
        prefix: "cfset",
        body: "<cfset ${1:variable} = ${2:expression}>",
        documentation: "```cfml\n<cfset variable = expression>\n```\nSets a value in CFML. Used to create a variable, if it does not exist, and assign it a value. Also used to call functions.",
    },
    {
        prefix: "cftry/cfcatch",
        body: "<cftry>\n<cfcatch type=\"${1:exception}\">\n</cfcatch>\n</cftry>",
        documentation: "```cfml\n<cftry>\n<cfcatch type=\"\">\n</cfcatch>\n</cftry>\n```\nUsed inside a cftry tag. Code in the cffinally block is processed after the main cftry code and, if an exception occurs, the cfcatch code. The cffinally block code always executes, whether or not there is an exception.",
    },
    {
        prefix: "cftry/cffinally",
        body: "<cftry>\n<cffinally>\n</cffinally>\n</cftry>",
        documentation: "```cfml\n<cftry>\n<cffinally>\n</cffinally>\n</cftry>\n```\nUsed inside a cftry tag. Code in the cffinally block is processed after the main cftry code and, if an exception occurs, the cfcatch code. The cffinally block code always executes, whether or not there is an exception.",
    },
    {
        prefix: "cftry/cfcatch/cffinally",
        body: "<cftry>\n<cfcatch type=\"${1:exception}\">\n</cfcatch>\n<cffinally>\n</cffinally>\n</cftry>",
        documentation: "```cfml\n<cftry>\n<cfcatch type=\"\">\n</cfcatch>\n<cffinally>\n</cffinally>\n</cftry>\n```\nUsed inside a cftry tag. Code in the cffinally block is processed after the main cftry code and, if an exception occurs, the cfcatch code. The cffinally block code always executes, whether or not there is an exception.",
    },
    {
        prefix: "cfloop: index loop",
        body: "<cfloop index=\"${1:index}\" from=\"${2:from}\" to=\"${3:to}\">\n</cfloop>",
        documentation: "```cfml\n<cfloop index=\"\" from=\"\" to=\"\">\n</cfloop>\n```\nAn index loop repeats for a number of times that is determined by a numeric value. An index loop is also known as a FOR loop.",
    },
    {
        prefix: "cfloop: conditional loop",
        body: "<cfloop condition=\"${1:expression}\">\n</cfloop>",
        documentation: "```cfml\n<cfloop condition=\"\">\n</cfloop>\n```\nA conditional loop iterates over a set of instructions as long as a condition is True. To use this type of loop correctly, the instructions must change the condition every time the loop iterates, until the condition is False. Conditional loops are known as WHILE loops, as in, \"loop WHILE this condition is true.\"",
    },
    {
        prefix: "cfloop: looping over a date or time range",
        body: "<cfloop index=\"${1:current value}\" from=\"${2:start time}\" to=\"${3:end time}\" step=\"#CreateTimeSpan(${4:days},0,0,0)#\">\n</cfloop>",
        documentation: "```cfml\n<cfloop index=\"\" from=\"\" to=\"\" step=\"#CreateTimeSpan(n,0,0,0)#\">\n</cfloop>\n```\nLoops over the date or time range specified by the from and to attributes. By default, the step is 1 day, but you can change the step by creating a timespan.",
    },
    {
        prefix: "cfloop: looping over a query",
        body: "<cfloop query=\"${1:query name}\">\n</cfloop>",
        documentation: "```cfml\n<cfloop query=\"\">\n</cfloop>\n```\nA loop over a query executes for each record in a query record set. The results are similar to those of the cfoutput tag. During each iteration, the columns of the current row are available for output. The cfloop tag loops over tags that cannot be used within a cfoutput tag.",
    },
    {
        prefix: "cfloop: struct",
        body: "<cfloop collection=\"#${1:struct}#\" item=\"${2:item}\">\n</cfloop>",
        documentation: "```cfml\n<cfloop collection=\"##\" item=\"\">\n</cfloop>\n```\nLooping over a struct.",
    },
    {
        prefix: "cfloop: array using item",
        body: "<cfloop array=\"#${1:array}#\" item=\"${2:item}\">\n</cfloop>",
        documentation: "```cfml\n<cfloop array=\"##\" item=\"\">\n</cfloop>\n```\nLooping over an array.",
    },
    {
        prefix: "cfloop: array using index",
        body: "<cfloop array=\"#${1:array}#\" index=\"${2:index}\">\n</cfloop>",
        documentation: "```cfml\n<cfloop array=\"##\" index=\"\">\n</cfloop>\n```\nLooping over an array.",
    },
    {
        prefix: "cfloop: list",
        body: "<cfloop list=\"#${1:list}#\" item=\"${2:item}\">\n</cfloop>",
        documentation: "```cfml\n<cfloop list=\"##\" item=\"\">\n</cfloop>\n```\nLooping over a list.",
    },
    {
        prefix: "cfloop: file",
        body: "<cfloop file=\"#${1:file}#\" item=\"${2:item}\">\n</cfloop>",
        documentation: "```cfml\n<cfloop file=\"##\" item=\"\">\n```\nLooping over a file.",
    },
];

export interface ISnippet {
    prefix: string;
    body: string;
    documentation: string;
}

export interface ICfmlSnippets {
    tags: ISnippet[];
    functions: ISnippet[];
}

export class CfmlSnippetsDataSource {
    public getSnippets(): Promise<ICfmlSnippets> {
        return new Promise<ICfmlSnippets>((resolve, reject) => {
            const result: ICfmlSnippets = {
                tags: null,
                functions: null,
            };

            const functionsFile = path.join(__dirname, "../../resources/snippets/functions.json");
            const tagsFile = path.join(__dirname, "../../resources/snippets/tags.json");
            fs.readFile(functionsFile, "utf8", (err, data) => {
                if (err) {
                    return resolve(result);
                }

                result.functions = JSON.parse(data);
                // tslint:disable-next-line:no-shadowed-variable
                fs.readFile(tagsFile, "utf8", (err, data) => {
                    if (err) {
                        return resolve(result);
                    }

                    result.tags = JSON.parse(data);
                    result.tags = result.tags.concat(TAG_SNIPPETS);
                    return resolve(result);
                });
            });
        });
    }
}
