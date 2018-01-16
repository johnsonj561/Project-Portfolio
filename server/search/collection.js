var natural = require('natural');
var TfIdf = natural.TfIdf;
const fse = require('fs-extra');

function Collection(path) {
  console.log('Collection created');
  this.path = path;
  this.documentList = [];
  this.tfidf = new TfIdf();
}

Collection.prototype.addDocument = function (projectName, text) {
  this.documentList.push({
    projectName,
    text
  });
  this.tfidf.addDocument(text);
}

Collection.prototype.removeDuplicates = function () {
  let unique = {};
  this.documentList.forEach(doc => {
    if (!unique[doc.url]) {
      unique[doc.url] = doc.text;
    }
  });
  this.documentList = [];
  this.tfidf = new TfIdf();
  Object.keys(unique).forEach(key => {
    this.addDocument(key, unique[key]);
  });
}


Collection.prototype.printDocuments = function () {
  this.documentList.forEach(doc => console.log(doc));
}

Collection.prototype.loadFromFile = function () {
  return new Promise((resolve, reject) => {
    fse.readJson(this.path)
      .then(resp => {
        this.documentList = resp.documentList;
        this.tfidf = new TfIdf();
        this.documentList.forEach(doc => this.tfidf.addDocument(doc.text));
        resolve(this);
      }).catch(err => reject('Unable to load json from ' + this.path + ': ' + err));
  });
}

Collection.prototype.saveToFile = function () {
  return new Promise((resolve, reject) => {
    fse.writeJSON(this.path, {
      'documentList': this.documentList
    }).then(resp => {
      console.log('Collection written to file: ' + this.path);
      resolve()
    }).catch(err => {
      console.log('Error writing to file: ' + this.path, err);
      reject(err);
    });
  });
}


module.exports = Collection;
