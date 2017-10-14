/**
 * Created by lexxy_000 on 19.09.2017.
 */
// var KeyValueObject = require("./keyvalueobject");
var oConst = require("./constants.json");

Response = function (oRes) {
    this.oResponse = oRes;
    this.iStatusCode = 200;
    this.aContent = [];
};

Response.getStatusCodeText = function(iCode){
    return oConst.StatusCodeText[iCode];
};
Response.prototype.setStatusCode = function (iValue) {
    this.iStatusCode = iValue;
};

Response.prototype.write = function (sValue) {
    this.aContent.push(sValue);
};

Response.prototype.end = function (oHttpHeader) {
    this.oResponse.statusCode = this.iStatusCode;

    if (typeof(oHttpHeader) !== "undefined") {

        var aHeaders = oHttpHeader.toArray();

        for(var iPosition in aHeaders){
            oHeader = aHeaders[iPosition];
            this.oResponse.setHeader(oHeader.getKey(), oHeader.getValue());
        }
    }

    var sContent = this.aContent.join("\r\n");
    this.oResponse.end(sContent);
};


module.exports = Response;