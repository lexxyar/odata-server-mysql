/**
 * Created by lexxy_000 on 20.09.2017.
 */
var KeyValueObject = require("./keyvalueobject");

HttpHeader = function () {
    this.sContentTransferEncoding = "";
    this.sDataServiceVersion = "";
    this.aAccessControlExposeHeaders = [];
    this.aAccessControlAllowHeaders = [];
    this.sAccessControlAllowOrigin = "";
    this.aAccessControlAllowMethods = [];
    this.sBatchId = "";
    this.sContentType = "";
    this.aCacheControl = [];
    this.iMaxage = -1;
    this.iSmaxage = -1;
    this.sContentTypeCharset = "";
    this.iContentLength = -1;
};

HttpHeader.prototype.setContentLength = function (iValue) {
    this.iContentLength = iValue;
};
HttpHeader.prototype.calculateContentLength = function (sValue) {
    this.iContentLength = Buffer.byteLength(sValue);
};
HttpHeader.prototype.getContentLength = function () {
    return new KeyValueObject("Content-Length", this.iContentLength);
};

HttpHeader.prototype.setDataServiceVersion = function (sVersion) {
    this.sDataServiceVersion = sVersion;
};
HttpHeader.prototype.getDataServiceVersion = function () {
    return new KeyValueObject("DataServiceVersion", this.sDataServiceVersion);
};

HttpHeader.prototype.setContentTransferEncoding = function (sEncoding) {
    this.sContentTransferEncoding = sEncoding;
};
HttpHeader.prototype.getContentTransferEncoding = function () {
    return new KeyValueObject("Content-Transfer-Encoding", this.sContentTransferEncoding);
};

HttpHeader.prototype.setAccessControlExposeHeaders = function (aHeaders) {
    this.aAccessControlExposeHeaders = aHeaders;
};
HttpHeader.prototype.getAccessControlExposeHeaders = function () {
    return new KeyValueObject("Access-Control-Expose-Headers", this.aAccessControlExposeHeaders.join(","));
};

HttpHeader.prototype.setAccessControlAllowHeaders = function (aHeaders) {
    this.aAccessControlAllowHeaders = aHeaders;
};
HttpHeader.prototype.getAccessControlAllowHeaders = function () {
    return new KeyValueObject("Access-Control-Allow-Headers", this.aAccessControlAllowHeaders.join(","));
};

HttpHeader.prototype.setAccessControlAllowOrigin = function (sValue) {
    this.sAccessControlAllowOrigin = sValue;
};
HttpHeader.prototype.getAccessControlAllowOrigin = function () {
    return this.sAccessControlAllowOrigin == "" ? null : new KeyValueObject("Access-Control-Allow-Origin", this.sAccessControlAllowOrigin);
};

HttpHeader.prototype.setAccessControlAllowMethods = function (aMethods) {
    this.aAccessControlAllowMethods = aMethods;
};
HttpHeader.prototype.getAccessControlAllowMethods = function () {
    return new KeyValueObject("Access-Control-Allow-Methods", this.aAccessControlAllowMethods.join(","));
};

HttpHeader.prototype.setMaxage = function (iValue) {
    this.iMaxage = iValue;
};
HttpHeader.prototype.setSMaxage = function (iValue) {
    this.iSMaxage = iValue;
};
HttpHeader.prototype.setCacheControl = function (aCaches) {
    this.aCacheControl = aCaches;
};
HttpHeader.prototype.getCacheControl = function () {
    // var aVals = [];
    var aVals = this.aCacheControl;

    if (this.iMaxage > -1) {
        aVals.push("max-age=" + oCases.iMaxage);
    }
    if (this.iSmaxage > -1) {
        aVals.push("s-maxage=" + oCases.iSmaxage);
    }

    return new KeyValueObject("Cache-Control", aVals.join(","));
};

HttpHeader.prototype.getBatchId = function () {
    return this.sBatchId;
};
HttpHeader.prototype.setBatchId = function (sValue) {
    this.sBatchId = sValue;
};
HttpHeader.prototype.getBatchBoundary = function () {
    return this.sBatchId == "" ? "" : ";boundary=" + this.sBatchId;
};

HttpHeader.prototype.setContentTypeCharset = function (sValue) {
    this.sContentTypeCharset = sValue;
};
HttpHeader.prototype.getContentTypeCharset = function () {
    return this.sContentTypeCharset == "" ? "" : ";charset=" + this.sContentTypeCharset;
};
HttpHeader.prototype.setContentType = function (sValue) {
    this.sContentType = sValue;
};
HttpHeader.prototype.getContentType = function () {
    var sValue = this.sContentType;
    sValue = sValue + this.getContentTypeCharset() + this.getBatchBoundary();
    return new KeyValueObject("Content-Type", sValue);
};

HttpHeader.prototype.toString = function () {
    var aLines = [];
    var aHeaders = this.toArray();
    for(var iPosition in aHeaders){
        var oValue = aHeaders[iPosition];
        aLines.push(oValue.toString(": "));
    }

    return aLines.join("\r\n");
};

HttpHeader.prototype.toArray = function () {
    var aLines = [];
    if (this.sContentType.trim() !== "") {
        aLines.push(this.getContentType());
    }
    if (this.aCacheControl.length > 0) {
        aLines.push(this.getCacheControl());
    }
    if (this.aAccessControlAllowMethods.length > 0) {
        aLines.push(this.getAccessControlAllowMethods());
    }
    if (this.aCacheControl.length > 0) {
        aLines.push(this.getCacheControl());
    }
    if (this.aAccessControlAllowMethods.length > 0) {
        aLines.push(this.getAccessControlAllowMethods());
    }
    if (this.sAccessControlAllowOrigin !== "") {
        aLines.push(this.getAccessControlAllowOrigin());
    }
    if (this.aAccessControlAllowHeaders.length > 0) {
        aLines.push(this.getAccessControlAllowHeaders());
    }
    if (this.aAccessControlExposeHeaders.length > 0) {
        aLines.push(this.getAccessControlExposeHeaders());
    }
    if (this.sContentTransferEncoding !== "") {
        aLines.push(this.getContentTransferEncoding());
    }
    if (this.sDataServiceVersion !== "") {
        aLines.push(this.getDataServiceVersion());
    }
    if (this.iContentLength !== -1) {
        aLines.push(this.getContentLength());
    }
    return aLines;
};

module.exports = HttpHeader;