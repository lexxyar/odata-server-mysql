/**
 * Created by lexxy_000 on 20.09.2017.
 */
HttpHeader.ContentType = {
    Text: "text/plain",
    Xml: "application/xml",
    Html: "text/html",
    Json: "application/json",
    Mixed: "multipart/mixed",
    Http: "application/http"
};

HttpHeader = function () {
    this.oContentType = {
        bText: false,
        bXml: false,
        bHtml: false,
        bJson: false,
        bMixed: false,
        bHttp: false
    };
    this.oContentType2 = {
        bText: false,
        bXml: false,
        bHtml: false,
        bJson: false,
        bMixed: false,
        bHttp: false
    };
    this.oCacheControl = {
        bNocache: false,
        bNostore: false,
        bNotransform: false,
        bMustrevalidate: false,
        bPublic: false,
        bPrivate: true,
        bProxyrevalidate: false,
        iMaxage: -1,
        iSmaxage: -1
    };
    this.oAccessControl = {
        oAllow: {
            oMethods: {
                bConnect: false,
                bDelete: true,
                bGet: true,
                bHead: false,
                bOption: false,
                bPatch: false,
                bPost: true,
                bPut: true
            }
            ,
            sOrigin: "*",
            oHeaders: {
                bAccept: true,
                bOrigin: true,
                bContentType: true,
                bMaxDataServiceVersion: true,
                bContentLength: false,
                bSapContextidAccept: true,
                bXCsrfToken: true,
                bSapCancelOnClose: true,
                bDataServiceVersion: true
            }
        }
        ,
        oExpose: {
            oHeaders: {
                bCacheControl: false,
                bContentLanguage: false,
                bContentType: false,
                bExpires: false,
                bLastModified: false,
                bPragma: false,
                bContentLength: true,

                bVary: false,
                bServer: false,
                bDataserviceversion: false,
                bDate: false,
                bConnection: false,
                bXFinalUrl: false,
                bAccessControlAllowOrigin: false
            }
        }
    };
    this.bContentTransferEncodingBinary = false;
    this.sDataServiceVersion = "1.0";

};


/**
 *
 */
HttpHeader.prototype.getDataServiceVersion = function () {
    var oRet = {key: "DataServiceVersion", value: this.sDataServiceVersion};
    return oRet;
};

/**
 *
 */
HttpHeader.prototype.getContentTransferEncoding = function () {
    var oRet = {key: "Content-Transfer-Encoding", value: this.bContentTransferEncodingBinary ? "binary" : "binary"};
    return oRet;
};

/**
 *
 * @returns {{key: string, value: string}}
 */
HttpHeader.prototype.getAccessControlExposeHeaders = function () {
    var aVals = [];
    var oCases = this.oAccessControl.oExpose.oHeaders;

    if (oCases.bCacheControl) {
        aVals.push("Cache-Control");
    }
    if (oCases.bContentLanguage) {
        aVals.push("Content-Language");
    }
    if (oCases.bContentType) {
        aVals.push("Content-Type");
    }
    if (oCases.bExpires) {
        aVals.push("Expires");
    }
    if (oCases.bLastModified) {
        aVals.push("Last-Modified");
    }
    if (oCases.bPragma) {
        aVals.push("Pragma");
    }
    if (oCases.bContentLength) {
        aVals.push("Content-Length");
    }

    if (oCases.bVary) {
        aVals.push("vary");
    }
    if (oCases.bServer) {
        aVals.push("server");
    }
    if (oCases.bDataserviceversion) {
        aVals.push("dataserviceversion");
    }
    if (oCases.bDate) {
        aVals.push("date");
    }
    if (oCases.bConnection) {
        aVals.push("connection");
    }
    if (oCases.bXFinalUrl) {
        aVals.push("x-final-url");
    }
    if (oCases.bAccessControlAllowOrigin) {
        aVals.push("access-control-allow-origin");
    }

    var oRet = {key: "Access-Control-Expose-Headers", value: aVals.join(",")};
    return oRet;
}

/**
 *
 * @returns {{key: string, value: string}}
 */
HttpHeader.prototype.getAccessControlAllowHeaders = function () {
    var aVals = [];
    var oCases = this.oAccessControl.oAllow.oHeaders;

    if (oCases.bAccept) {
        aVals.push("Accept");
    }
    if (oCases.bOrigin) {
        aVals.push("Origin");
    }
    if (oCases.bContentType) {
        aVals.push("Content-Type");
    }
    if (oCases.bMaxDataServiceVersion) {
        aVals.push("MaxDataServiceVersion");
    }
    if (oCases.bContentLength) {
        aVals.push("Content-Length");
    }
    if (oCases.bSapContextidAccept) {
        aVals.push("sap-contextid-accept");
    }
    if (oCases.bXCsrfToken) {
        aVals.push("x-csrf-token");
    }
    if (oCases.bSapCancelOnClose) {
        aVals.push("sap-cancel-on-close");
    }
    if (oCases.bDataServiceVersion) {
        aVals.push("DataServiceVersion");
    }


    var oRet = {key: "Access-Control-Allow-Headers", value: aVals.join(",")};
    return oRet;
}

/**
 *
 * @returns {{key: string, value: string}}
 */
HttpHeader.prototype.getAccessControlAllowOrigin = function () {
    var oRet = {key: "", value: ""};
    if (this.oAccessControl.oAllow.sOrigin != "") {
        oRet = {key: "Access-Control-Allow-Origin", value: this.oAccessControl.oAllow.sOrigin};
    }
    return oRet;
}

/**
 *
 * @returns {{key: string, value: string}}
 */
HttpHeader.prototype.getAccessControlAllowMethods = function () {
    var aVals = [];
    var oCases = this.oAccessControl.oAllow.oMethods;

    if (oCases.bConnect) {
        aVals.push("CONECT");
    }
    if (oCases.bDelete) {
        aVals.push("DELETE");
    }
    if (oCases.bGet) {
        aVals.push("GET");
    }
    if (oCases.bHead) {
        aVals.push("HEAD");
    }
    if (oCases.bOption) {
        aVals.push("OPTION");
    }
    if (oCases.bPatch) {
        aVals.push("PATCH");
    }
    if (oCases.bPost) {
        aVals.push("POST");
    }
    if (oCases.bPut) {
        aVals.push("PUT");
    }

    var oRet = {key: "Access-Control-Allow-Methods", value: aVals.join(",")};
    return oRet;
}

/**
 *
 * @returns {{key: string, value: string}}
 */
HttpHeader.prototype.getCacheControl = function () {
    var aVals = [];
    var oCases = this.oCacheControl;


    if (oCases.bMustrevalidate) {
        aVals.push("must-revalidate");
    }
    if (oCases.bNocache) {
        aVals.push("no-cache");
    }
    if (oCases.bNostore) {
        aVals.push("no-store");
    }
    if (oCases.bNotransform) {
        aVals.push("no-transform");
    }
    if (oCases.bPrivate) {
        aVals.push("private");
    }
    if (oCases.bProxyrevalidate) {
        aVals.push("proxy-revalidate");
    }
    if (oCases.bPublic) {
        aVals.push("public");
    }

    if (oCases.iMaxage > -1) {
        aVals.push("max-age=" + oCases.iMaxage);
    }
    if (oCases.iSmaxage > -1) {
        aVals.push("s-maxage=" + oCases.iSmaxage);
    }

    var oRet = {key: "Cache-Control", value: aVals.join(",")};
    return oRet;
}

/**
 *
 * @param bUtf8
 * @returns {{key: string, value: string}}
 */
HttpHeader.prototype.getContentType = function (bUtf8, sBatchId, b2) {
    bUtf8 = typeof (bUtf8) === "undefined" ? true : bUtf8;
    sBatchId = typeof (sBatchId) === "undefined" ? "" : "; boundary=" + sBatchId;
    b2 = typeof (b2) === "undefined" ? false : b2;
    var sUtf8 = bUtf8 ? ";charset=utf-8" : "";
    var sValue = "";
    var oCases = b2 ? this.oContentType2 : this.oContentType;
    switch (true) {
        case oCases.bHtml:
            sValue = "text/html";
            break;
        case oCases.bJson:
            sValue = "application/json";
            break;
        case oCases.bText:
            sValue = "text/plain";
            break;
        case oCases.bXml:
            sValue = "application/xml";
            break;
        case oCases.bMixed:
            sValue = "multipart/mixed" + sBatchId;
            break;
        case oCases.bHttp:
            sValue = "application/http";
            break;
        default:
            sValue = "text/plain";
            break;
    }
    sValue += sUtf8;
    var oRet = {key: "Content-Type", value: sValue};
    return oRet;
}

module.exports = HttpHeader;