var oConfig = require("./config.json");
var oResponse = require("./response");
// var KeyValueObject = require("./keyvalueobject");

BatchItem = function () {
    this.sStatusCode = 200;
    this.oHeader = null;
};

BatchItem.prototype.setStatusCode = function (iValue) {
    this.sStatusCode = iValue;
    this.oHeader = null;
    this.sContent = "";
};

BatchItem.prototype.setHeader = function (oHeader) {
    this.oHeader = oHeader;
};

BatchItem.prototype.setContent = function (sContent) {
    this.sContent = sContent;
};

BatchItem.prototype.toString = function () {
    var aLines = [];

    aLines.push("HTTP/" + oConfig.server.httpVersion + " " + this.sStatusCode + " " + oResponse.getStatusCodeText(this.sStatusCode));
    aLines.push(this.oHeader.toString());
    aLines.push("");
    aLines.push(this.sContent);
    aLines.push("");
    return aLines.join("\r\n");
};

module.exports = BatchItem;