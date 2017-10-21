// <cf tag exists
function containsCFTag(text) {
  return text.search(/\<\/?cf/) !== -1;
}

// selection contains "<cfscript or </cfscript"
function containsCFScriptTag(text) {
  return text.search(/<\/?cfscript/) !== -1;
}

// Check if the last instance of <cf or </cf is <cfscript.
function isLastTagCFScript(text) {
  // sometimes text.match().reverse() fails due to "reverse"
  // opinion: default behavior should be cfscript style comment, default result to "true"
  var result = true;
  try {
    result =
      text.match(/\<\/?cf(?!.*\<\/?cf).{0,6}/g).reverse()[0] === '<cfscript';
  } catch (e) {}
  return result;
}

/**
 * Returns true if the comment should use tag style comments, otherwise false.
 * @param {string} docText
 * @param {string} beforeSelection 
 * @param {string} selection 
 * @param {number} line 
 */
function isTagComment(docText, beforeSelection, selection, line) {
  return (
    containsCFTag(docText) &&
    (line === 0 ||
      containsCFScriptTag(selection) ||
      !isLastTagCFScript(beforeSelection))
  );
}

module.exports = {
  containsCFTag: containsCFTag,
  containsCFScriptTag: containsCFScriptTag,
  isLastTagCFScript: isLastTagCFScript,
  isTagComment: isTagComment
};
