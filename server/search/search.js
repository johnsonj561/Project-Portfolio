var natural = require('natural');
var TfIdf = natural.TfIdf;
const fse = require('fs-extra');

/**
 * Calculate TfIdf values of 1 document
 */
function calcTfIdf(doc) {
  const tfidf = new TfIdf();
  tfidf.addDocument(doc);
  return tfidf.listTerms(0);
}

module.exports = {
  calcTfIdf,
  
}
