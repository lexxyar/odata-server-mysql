KeyValueObject = function (sKey, sValue) {
    this.sKey = sKey;
    this.sValue = sValue;
};

KeyValueObject.prototype.getKey = function () {
    return this.sKey;
};

KeyValueObject.prototype.getValue = function () {
    return this.sValue;
};

KeyValueObject.prototype.toString = function (sKeyValueDelimiter) {
    sKeyValueDelimiter = typeof (sKeyValueDelimiter) === "undefined" ? "" : sKeyValueDelimiter;
    return this.sKey + sKeyValueDelimiter + this.sValue;
};

module.exports = KeyValueObject;