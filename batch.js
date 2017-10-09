/**
 * Created by lexxy_000 on 22.09.2017.
 */

Batch = function () {
    this.aResponse= [];
};

Batch.prototype = {
    sGuid: "18178bb0-b831-b48c-34a8-5b451b710888",
    aResponse: []
};

Batch.prototype.Parse = function (sBody) {
    var aLines = sBody.split("\r\n");
    this.aRequests = []
    var aRequest = [];
    this.id = "";
    for (var i = 0; i < aLines.length; i++) {
        var sLine = aLines[i];
        if (sLine === "") {
            continue;
        }
        if (sLine.length > 2 && sLine.substr(0, 2) === "--") {
            if (this.id === "") {
                this.id = sLine.substr(2);
            }
            if (aRequest.length > 0) {
                this.aRequests.push(aRequest);
            }
            aRequest = [];
            continue;
        }

        aRequest.push(sLine);
    }
};

Batch.prototype.getRequestCount = function () {
    return this.aRequests.length;
};

Batch.prototype.getRequest = function (iIndex) {
    if (iIndex < 0 || iIndex >= this.getRequestCount()) {
        return "";
    }
    var aBatch = this.aRequests[iIndex]
    var sRequest = "";
    for (var i = 0; i < aBatch.length; i++) {
        var sLine = aBatch[i];
        if (sLine.length < 4) {
            continue;
        }
        if (sLine.substr(0, 3) === "GET") {
            sRequest = sLine.substr("GET ".length, sLine.length - "GET ".length - " HTTP/1.1".length);
            break;
        }
    }
    console.log(sRequest);
    return sRequest;
};

Batch.prototype.generateGUID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

Batch.prototype.getGuid = function () {
    return this.sGuid;
};

/**
 *
 * @param oHeader
 * @param sBody
 */
Batch.prototype.addResponse = function (oHeader, sBody) {
    oResp = {
        oHeader: oHeader,
        sBody: sBody
    };
    this.aResponse.push(oResp);
};

Batch.prototype.generateResponseBody = function () {
    this.generateGUID();
    var aLines = [];
    var i = 0;
    var sGuidPrefix = "--";
    for (i = 0; i < this.aResponse.length; i++) {
        var oResp = this.aResponse[i];
        // aLines.push(sGuidPrefix + this.getGuid());
        aLines.push(sGuidPrefix + this.id);

        var oHeader = {};

        oHeader = oResp.oHeader.getContentType(false);
        aLines.push(oHeader.key + ": " + oHeader.value);

        oHeader = oResp.oHeader.getContentTransferEncoding();
        aLines.push(oHeader.key + ": " + oHeader.value);

        aLines.push("");

        aLines.push("HTTP/1.1 200 OK");

        oHeader = oResp.oHeader.getCacheControl();
        aLines.push(oHeader.key + ": " + oHeader.value);

        oHeader = oResp.oHeader.getDataServiceVersion();
        aLines.push(oHeader.key + ": " + oHeader.value);

        oHeader = oResp.oHeader.getContentType(true,"undefined",true);
        aLines.push(oHeader.key + ": " + oHeader.value);

        // oHeader = oResp.oHeader.getAccessControlAllowOrigin();
        // aLines.push(oHeader.key + ": " + oHeader.value);

        aLines.push("");

        aLines.push(oResp.sBody);
    }
    aLines.push(sGuidPrefix + this.id + "--");
    return aLines.join("\r\n");
};

module.exports = Batch;