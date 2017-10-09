/**
 * Created by lexxy_000 on 21.09.2017.
 */

Err = function (sMessage, sCode, sLang) {
    this.oMessage.sValue = typeof (sMessage) !== "undefined" ? sMessage : "";
    this.oMessage.sLang = typeof (sLang) !== "undefined" ? sLang : "en-US";
    this.sCode = typeof (sCode) !== "undefined" ? sCode : "";
};

Err.prototype = {
    sCode: "",
    oMessage: {
        sLang: "",
        sValue: ""
    }
}

Err.prototype.getError = function () {
    var oRet = {
        error: {
            code: this.sCode,
            message: {
                lang: this.oMessage.sLang,
                value: this.oMessage.sValue
            }
        }
    };
    return oRet;
}

module.exports = Err;