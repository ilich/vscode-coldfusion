const assert = require('assert');
const {
  containsCFTag,
  containsCFScriptTag,
  isLastTagCFScript,
  isTagComment
} = require('../matchers');

describe('containsCFTag', function() {
  it('should return false if no <cf> tags exist', function() {
    let string = `component {
                        public void function foo() {
                            WriteOutput("Method foo() called<br/>");
                        }

                        public function getString() {
                            var x = "hello";
                            return x;
                        }
                    }`;
    assert.equal(
      containsCFTag(string),
      false,
      'incorrectly found a <cf> tag in component definition'
    );

    string = `function Sum(a, b) {
            var sum = a + b;
            return sum;
        }`;
    assert.equal(
      containsCFTag(string),
      false,
      'incorrectly found a <cf> tag in function definition'
    );
  });

  it('should return true if <cf> tags exist', function() {
    let string = `<cfif IsDefined("form.myValue")> 
                        <cfif IsNumeric(form.myValue)> 
                            <cfset x = form.myValue> 
                            <cfscript> 
                                y = x; 
                                z = 2 * y; 
                                StringVar = form.myString; 
                            </cfscript> 
                        <cfoutput>        <p>twice #x# is #z#. 
                            <p>Your string value was: <b><I>#StringVar#</i></b>    </cfoutput> 
                    <cfelse>`;
    assert.equal(containsCFTag(string), true, 'did not find <cf> tag');

    string = `if IsNumeric(form.myValue)> 
                    <cfs`;
    assert.equal(
      containsCFTag(string),
      true,
      'did not find <cf> tag in partial string'
    );

    string = `        <p>twice #x# is #z#. 
        <p>Your string value was: <b><I>#StringVar#</i></b>    </cfoutput>`;
    assert.equal(
      containsCFTag(string),
      true,
      'did not find <cf> tag when only matching tags were closing tags'
    );
  });
});

describe('containsCFScriptTag', function() {
  it('should return false if no cf tags are present', function() {
    let string = `function Sum(a, b) {
            var sum = a + b;
            return sum;
        }`;
    assert.equal(
      containsCFScriptTag(string),
      false,
      'incorrectly found a <cfscript> tag in function definition'
    );
  });

  it('should return false if cf tags are present but no cfscript', function() {
    let string = `<cfif IsDefined("form.myValue")> 
                        <cfif IsNumeric(form.myValue)> 
                            <cfset x = form.myValue> 
                        <cfoutput>        <p>twice #x# is #z#. 
                            <p>Your string value was: <b><I>#StringVar#</i></b>    </cfoutput> 
                    <cfelse>`;
    assert.equal(
      containsCFScriptTag(string),
      false,
      'found a <cfscript> tag when none was present'
    );
  });

  it('should return true if a cfscript tag is present', function() {
    let string = `<cfif IsDefined("form.myValue")> 
                        <cfif IsNumeric(form.myValue)> 
                            <cfset x = form.myValue> 
                            <cfscript> 
                                y = x; 
                                z = 2 * y; 
                                StringVar = form.myString; 
                            </cfscript> 
                        <cfoutput>        <p>twice #x# is #z#. 
                            <p>Your string value was: <b><I>#StringVar#</i></b>    </cfoutput> 
                    <cfelse>`;
    assert.equal(
      containsCFScriptTag(string),
      true,
      'did not find <cfscript> tag in multi-line string'
    );

    string = `<cfif IsDefined("form.myValue")> 
                <cfif IsNumeric(form.myValue)> 
                    <cfset x = form.myValue> 
                    <cfscript> 
                        y = x;`;
    assert.equal(
      containsCFScriptTag(string),
      true,
      'did not find <cfscript> when no closing tag was present'
    );

    string = `<cfif IsDefined("form.myValue")> <cfif IsNumeric(form.myValue)> <cfset x = form.myValue> <cfscript> y = x;`;
    assert.equal(
      containsCFScriptTag(string),
      true,
      'did not find <cfscript> in single line string'
    );

    string = `<cfscript>`;
    assert.equal(
      containsCFScriptTag(string),
      true,
      'did not find <cfscript> when that was the entire string'
    );
  });

  it('should return true if a closing cfscript tag is present', function() {
    string = `y = x; 
                        z = 2 * y; 
                        StringVar = form.myString; 
                    </cfscript> 
                <cfoutput>        <p>twice #x# is #z#. 
                    <p>Your string value was: <b><I>#StringVar#</i></b>    </cfoutput> 
                <cfelse>`;
    assert.equal(
      containsCFScriptTag(string),
      true,
      'did not find </cfscript> when no opening tag was present'
    );

    string = `y = x; z = 2 * y; StringVar = form.myString; </cfscript><cfoutput> <p>twice #x# is #z#. </cfoutput> <cfelse>`;
    assert.equal(
      containsCFScriptTag(string),
      true,
      'did not find </cfscript> in single line string'
    );

    string = `</cfscript>`;
    assert.equal(
      containsCFScriptTag(string),
      true,
      'did not find </cfscript> when that was the entire string'
    );
  });
});

describe('isLastTagCFScript', function() {
  it('should return false when cfscript tag is not the last tag in the string', function() {
    let string = `<cfscript>
                    y = x; 
                    z = 2 * y; 
                    StringVar = form.myString; 
                </cfscript> 
            <cfoutput>        <p>twice #x# is #z#. 
                <p>Your string value was: <b><I>#StringVar#</i></b>    </cfoutput> 
            <cfelse>`;
    assert.equal(
      isLastTagCFScript(string),
      false,
      'it thought that <cfelse> was a <cfscript> tag'
    );

    string = `<cfscript>
                    y = x; 
                    z = 2 * y; 
                    StringVar = form.myString; 
                </cfscript>`;
    assert.equal(
      isLastTagCFScript(string),
      false,
      'it thought that a closing </cfscript> tag was an opening <cfscript> tag'
    );
  });
  it('should return true when cfscript is the last tag in the string', function() {
    let string = `<cfscript>
                    y = x; 
                    z = 2 * y; 
                    StringVar = form.myString; `;
    assert.equal(
      isLastTagCFScript(string),
      true,
      'did not recognize the last tag as cfscript when cfscript is the only tag present'
    );

    string = `<cfif IsDefined("form.myValue")> 
            <cfif IsNumeric(form.myValue)> 
                <cfset x = form.myValue> 
                <cfscript> 
                    y = x; `;
    assert.equal(
      isLastTagCFScript(string),
      true,
      'did not recognize last tag as cfscript when other tags exist above it'
    );

    string = `<cfscript>`;
    assert.equal(
      isLastTagCFScript(string),
      true,
      'failed to recognize the string "<cfscript>" as the last cf tag'
    );
  });
});

/**
 * Each test case in this suite should be passed two strings:
 * 1. the text before the selection
 * 2. the selection
 * These are slightly different depending on whether or not the comment is a block comment or a line comment, but can be simulated in the same way.
 * 
 * In the actual extension, these are determined with the vscode API, but here they are just simulated
 */
describe('isTagComment', function() {
  it('should use cfscript comments in a cfscript-style component definition', function() {
    let beforeText = `component {
            this.name = "right"`;
    let selectedText = `this.name = "commented"`;
    assert.equal(isTagComment(beforeText, selectedText), false);
  });
  it('should use cfscript comments on line(s) within a <cfscript> tag in a tag-based file', function() {
    let beforeText = `<cfoutput>something</cfoutput>
            <cfscript>
                line = "uncommented"`;
    let selectedText = `line = "commented"`;
    assert.equal(isTagComment(beforeText, selectedText), false);
  });
  it('should use tag comments in a tag-based file', function() {
    let beforeText = `<cfoutput>
            #myNewVar#`;
    let selectedText = `#myOldVar#`;
    assert.equal(isTagComment(beforeText, selectedText), true);
  });
  it('should use tag comments when text contains both script code and tag code', function() {
    let beforeText = `<cfoutput>
                <!--- #myOldVar# --->
                #myNewVar#
            </cfoutput>`;
    let selectedText = `<cfscript>
                no longer needed
                myOldVar = 42
            </cfscript>`;
    assert.equal(isTagComment(beforeText, selectedText), true);
  });
  it('should use tag comments if the line(s) being commented include a <cfscript> opening or closing tag', function() {
    let beforeText = `<cfoutput>`;
    let selectedText = `<cfscript>notNecessary = true</cfscript>`;
    assert.equal(isTagComment(beforeText, selectedText), true);
  });

  // This test currently fails, but is being added for documentation purposes
  // Would be nice to get this working eventually
  it.skip(
    'should use cfscript comments on code within a <script> tag',
    function() {
      let beforeText = `<cfoutput><script>`;
      let selectedText = `var el = document.getElementById('el')`;
      assert.equal(
        isTagComment(beforeText, selectedText),
        true,
        'used tag comments on javascript inside <script> tag'
      );
    }
  );

  // This test currently fails, but is being added for documentation purposes.
  // Would be nice to get this working eventually
  it.skip(
    'should ignore commented-out cfscript tags when determining tag context',
    function() {
      let beforeText = `<!--- <cfscript --->`;
      let selectedText = `myVar = 42`;
      assert.equal(
        isTagComment(beforeText, selectedText),
        false,
        'used cfscript comments even though the cfscript tag directly above was commented out'
      );
    }
  );
});
