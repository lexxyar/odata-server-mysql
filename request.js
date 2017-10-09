/**
 * Created by lexxy_000 on 19.09.2017.
 */

var url = require("url");
var Err = require("./err");

Request = function (oReq) {
    this.oRequest = oReq;
    this.oError = null;
    this.sUri = this.oRequest.url;
    this.sPathName = url.parse(this.sUri, true).pathname;
    this.sMethod = this.oRequest.method;

    this.parseUrl(this.sPathName);
    /*
    var aUrlParts = this.sPathName.split("/");

    // console.log(aUrlParts);
    this.bCount = aUrlParts[aUrlParts.length - 1] === "$count";
    this.bBatch = aUrlParts[aUrlParts.length - 1] === "$batch";
    this.bValue = false;
    // console.log(this.bCount);


    this.sServiceName = aUrlParts[1] === undefined ? "" : aUrlParts[1];
    if (!this.bBatch) {
        this.sEntitySetName = aUrlParts[2] === undefined ? "" : aUrlParts[2];
        this.sEntityFieldName = aUrlParts[3] === undefined ? "" : aUrlParts[3];
        this.sKeys = "";
        if (this.sEntitySetName.indexOf('(') !== -1) {
            this.sKeys = this.sEntitySetName.substr(this.sEntitySetName.indexOf('('));
            this.sEntitySetName = this.sEntitySetName.substr(0, this.sEntitySetName.indexOf('('));
        }
        this.sEntityName = this.sEntitySetName.substr(0, this.sEntitySetName.length - 3);


        this.sKeys = this.sKeys.substr(1, this.sKeys.length - 2);
        this.aKeys = [];
        if (this.sKeys !== "") {
            if (this.bCount) {
                this.oError = new Err("Resource not found for the segment 'The request URI is not valid, since the segment '" +
                    this.sEntitySetName + "' refers to a singleton, and the segment '$count' can only follow a resource collection.'.");
                return;
            }
            var aKeys = this.sKeys.split(",");
            for (var i = 0; i < aKeys.length; i++) {
                var sRow = aKeys[i];
                var oKey = {field: "", value: ""};
                if (sRow.indexOf("=") === -1) {
                    oKey.field = "id";
                    oKey.value = sRow;
                } else {
                    var aVals = sRow.split("=");
                    oKey.field = aVals[0];
                    oKey.value = aVals[1];
                }
                this.aKeys.push(oKey);
                // console.log(this.aKeys);
            }

            this.bValue = aUrlParts[aUrlParts.length - 1] === "$value";
            if (this.sEntityFieldName === "") {
                this.bValue = false;
            }
        }
    }
    */
};

Request.prototype.parseUrl = function (sUrl) {
    var iQuestionSignPosition = sUrl.indexOf("?");
    if(iQuestionSignPosition >= 0){
        this.sPathName = sUrl.substr(0, iQuestionSignPosition);
    }else{
        this.sPathName = sUrl;
    }
    // var aReqPar = sUrl.split("?") //data.svc/PersonSet?$skip=0&$top=100

    var aUrlParts = this.sPathName.split("/");
    this.bCount = aUrlParts[aUrlParts.length - 1] === "$count";
    this.bBatch = aUrlParts[aUrlParts.length - 1] === "$batch";
    this.bValue = false;
    this.sServiceName = aUrlParts[1] === undefined ? "" : aUrlParts[1];
    this.sServiceName = aUrlParts[1] === undefined ? "" : aUrlParts[1];
    if (!this.bBatch) {
        this.sEntitySetName = aUrlParts[2] === undefined ? "" : aUrlParts[2];
        this.sEntityFieldName = aUrlParts[3] === undefined ? "" : aUrlParts[3];
        this.sKeys = "";
        if (this.sEntitySetName.indexOf('(') !== -1) {
            this.sKeys = this.sEntitySetName.substr(this.sEntitySetName.indexOf('('));
            this.sEntitySetName = this.sEntitySetName.substr(0, this.sEntitySetName.indexOf('('));
        }
        this.sEntityName = this.sEntitySetName.substr(0, this.sEntitySetName.length - 3);


        this.sKeys = this.sKeys.substr(1, this.sKeys.length - 2);
        this.aKeys = [];
        if (this.sKeys !== "") {
            if (this.bCount) {
                this.oError = new Err("Resource not found for the segment 'The request URI is not valid, since the segment '" +
                    this.sEntitySetName + "' refers to a singleton, and the segment '$count' can only follow a resource collection.'.");
                return;
            }
            var aKeys = this.sKeys.split(",");
            for (var i = 0; i < aKeys.length; i++) {
                var sRow = aKeys[i];
                var oKey = {field: "", value: ""};
                if (sRow.indexOf("=") === -1) {
                    oKey.field = "id";
                    oKey.value = sRow;
                } else {
                    var aVals = sRow.split("=");
                    oKey.field = aVals[0];
                    oKey.value = aVals[1];
                }
                this.aKeys.push(oKey);
                // console.log(this.aKeys);
            }

            this.bValue = aUrlParts[aUrlParts.length - 1] === "$value";
            if (this.sEntityFieldName === "") {
                this.bValue = false;
            }
        }
    }
};

Request.prototype.isError = function () {
    return this.oError !== null;
};

Request.prototype.isValue = function () {
    return this.bValue;
};

Request.prototype.isCount = function () {
    return this.bCount;
};

Request.prototype.isFavicon = function () {
    return this.sPathName === "/favicon.ico";
};

Request.prototype.isMethod = function (sMethod) {
    return this.sMethod === sMethod.toUpperCase();
};

Request.prototype.isGet = function () {
    return this.isMethod("GET");
};
Request.prototype.isOptions = function () {
    return this.isMethod("OPTIONS");
};
Request.prototype.isPut = function () {
    return this.isMethod("PUT");
};
Request.prototype.isPost = function () {
    return this.isMethod("POST");
};
Request.prototype.isDelete = function () {
    return this.isMethod("DELETE");
};
Request.prototype.isHead = function () {
    return this.isMethod("HEAD");
};
Request.prototype.isMetadata = function () {
    return this.sEntitySetName === "$metadata";
};
Request.prototype.isServiceDescription = function () {
    return this.sEntitySetName === "";
};
Request.prototype.isBatch = function () {
    return this.bBatch;
};


module.exports = Request;