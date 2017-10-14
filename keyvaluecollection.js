var KeyValueObject = require("./keyvalueobject");

KeyValueCollection = function () {
    this.aValues = [];
};

KeyValueCollection.prototype.set = function (sKey, sValue) {
    this.aValues[sKey] = new KeyValueObject(sKey, sValue);
};

KeyValueCollection.prototype.has = function (sKey) {
    var aKeys = this.aValues.keys();
    return aKeys.indexOf(sKey) !== -1;
};

KeyValueCollection.prototype.get = function (sKey) {
    return this.aValues[sKey].getValue();
};

KeyValueCollection.prototype.toString = function (sKeyValueDelimiter, sLinesDelimiter) {
    sKeyValueDelimiter = typeof (sKeyValueDelimiter) === "undefined" ? "" : sKeyValueDelimiter;
    sLinesDelimiter = typeof (sLinesDelimiter) === "undefined" ? "\r\n" : sLinesDelimiter;
    var aLines = [];
    for (var sKey in this.aValues) {
        var oKv = this.aValues[sKey];
        aLines.push(oKv.toString(sKeyValueDelimiter));
    }
    return aLines.join(sLinesDelimiter);
};

module.exports = KeyValueCollection;