/**
 * Created by lexxy_000 on 19.09.2017.
 */

Response = function (oRes) {
    this.oResponse = oRes;
    this._clear();
};

Response.prototype = {
    aHeaders: [],
    aContent: [],
    oConfig: {
        oStatusCode: {
            bNotFound: false,
            bAccepted: false,
            bAccepted202: false,
            bIternalError: false,
            bNotImplemented: false
        },
        bContentLength: false
    }
};

Response.prototype._clear = function () {
    this.aHeaders = [];
    this.aContent = [];
    this.oConfig.oStatusCode.bNotFound
        = this.oConfig.oStatusCode.bIternalError
        = this.oConfig.oStatusCode.bAccepted
        = this.oConfig.oStatusCode.bAccepted202
        = this.oConfig.oStatusCode.bNotImplemented
        = false;
    this.oConfig.bContentLength = true;
};

Response.prototype.setHeader = function (sKey, sValue) {
    var oHeader = {key: sKey, value: sValue};
    this.aHeaders.push(oHeader);
};

Response.prototype.write = function (sValue) {
    this.aContent.push(sValue);
};

Response.prototype._statusCodeFromConfig = function () {
    var oCases = this.oConfig.oStatusCode;
    switch (true) {
        case oCases.bAccepted: {
            this.oResponse.statusCode = 204;
            break;
        }
        case oCases.bAccepted202: {
            this.oResponse.statusCode = 202;
            break;
        }
        case oCases.bIternalError: {
            this.oResponse.statusCode = 500;
            break;
        }
        case oCases.bNotFound: {
            this.oResponse.statusCode = 404;
            break;
        }
        case oCases.bNotImplemented: {
            this.oResponse.statusCode = 501;
            break;
        }
        default: {
            this.oResponse.statusCode = 200;
            break;
        }
    }
};

/**
 *
 * @param HttpHeader oHttpHeader
 */
Response.prototype.end = function (oHttpHeader, sBatchId) {
    var i;
    var sContent = this.aContent.join("");
    var bBatch = typeof (sBatchId) !== "undefined";
    sBatchId = typeof (sBatchId) === "undefined" ? "" : sBatchId;
    this._statusCodeFromConfig();

    var oRes;

    if (typeof(oHttpHeader) !== "undefined") {
        oRes = oHttpHeader.getContentType(false, (bBatch ? sBatchId : "undefined"));
        this.oResponse.setHeader(oRes.key, oRes.value);

        oRes = oHttpHeader.getCacheControl();
        this.oResponse.setHeader(oRes.key, oRes.value);

        oRes = oHttpHeader.getAccessControlAllowOrigin();
        this.oResponse.setHeader(oRes.key, oRes.value);

        oRes = oHttpHeader.getAccessControlAllowMethods();
        this.oResponse.setHeader(oRes.key, oRes.value);

        oRes = oHttpHeader.getAccessControlAllowHeaders();
        this.oResponse.setHeader(oRes.key, oRes.value);

        oRes = oHttpHeader.getAccessControlExposeHeaders();
        this.oResponse.setHeader(oRes.key, oRes.value);
    }

    if (this.oConfig.bContentLength) {
        this.setHeader("Content-Length", Buffer.byteLength(sContent));
    }
    for (i in this.aHeaders) {
        var oItem = this.aHeaders[i];
        this.oResponse.setHeader(oItem.key, oItem.value);
    }
    this.oResponse.write(sContent);
    this.oResponse.end();
};


module.exports = Response;