// var Batch = require("./batch");

BatchResponse = function () {
    this.sId = this.generateId();
    this.aResponse = [];
    this.CommonHeader = null;
};

BatchResponse.prototype.generateId = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

BatchResponse.prototype.setId = function (sValue) {
    this.sId = sValue;
};
BatchResponse.prototype.getId = function () {
    return this.sId;
};

BatchResponse.prototype.addItem = function (oBatchItem) {
    this.aResponse.push(oBatchItem);
};

BatchResponse.prototype.setCommonHeader = function(oHeader){
  this.CommonHeader = oHeader;
};

BatchResponse.prototype.toString = function () {
    var aLines = [];

    for (var iPosition in this.aResponse) {
        var oResp = this.aResponse[iPosition];

        aLines.push("--" + this.sId);

        // var oHeader = null;

        // oHeader = this.CommonHeader.getContentType();
        // aLines.push(oHeader.key + ": " + oHeader.value);
        //
        // oHeader = this.CommonHeader.getContentTransferEncoding();
        // aLines.push(oHeader.key + ": " + oHeader.value);

        aLines.push(this.CommonHeader.toString());
        aLines.push("");

        aLines.push(oResp.toString());


        // // aLines.push(sGuidPrefix + this.getGuid());
        // aLines.push(sGuidPrefix + this.id);
        //
        // var oHeader = {};
        //
        // oHeader = oResp.oHeader.getContentType(false);
        // aLines.push(oHeader.key + ": " + oHeader.value);
        //
        // oHeader = oResp.oHeader.getContentTransferEncoding();
        // aLines.push(oHeader.key + ": " + oHeader.value);
        //
        // aLines.push("");
        //
        // aLines.push("HTTP/1.1 200 OK");
        //
        // oHeader = oResp.oHeader.getCacheControl();
        // aLines.push(oHeader.key + ": " + oHeader.value);
        //
        // oHeader = oResp.oHeader.getDataServiceVersion();
        // aLines.push(oHeader.key + ": " + oHeader.value);
        //
        // oHeader = oResp.oHeader.getContentType(true, "undefined", true);
        // aLines.push(oHeader.key + ": " + oHeader.value);
        //
        // // oHeader = oResp.oHeader.getAccessControlAllowOrigin();
        // // aLines.push(oHeader.key + ": " + oHeader.value);
        //
        // aLines.push("");
        //
        // aLines.push(oResp.sBody);
    }
    aLines.push("--" + this.getId() + "--");
    return aLines.join("\r\n");
};

module.exports = BatchResponse;