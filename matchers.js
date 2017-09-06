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
  return text.match(/\<\/?cf(?!.*\<\/?cf).{0,6}/g).reverse()[0] === '<cfscript';
}

function isTagComment(beforeSelection, selection) {
  return (
    containsCFTag(beforeSelection) &&
    (containsCFScriptTag(selection) || !isLastTagCFScript(beforeSelection))
  );
}

module.exports = {
  containsCFTag: containsCFTag,
  containsCFScriptTag: containsCFScriptTag,
  isLastTagCFScript: isLastTagCFScript,
  isTagComment: isTagComment
};
