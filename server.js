var oConfig = require("./config.json");

var server = null;
if (oConfig.server.useHttps) {
    var https = require("https");
    var fs = require("fs");

    var options = {
        key: fs.readFileSync("odata.key"),
        cert: fs.readFileSync("odata.cert"),
        requestCert: false,
        rejectUnauthorized: false
    };
    server = new https.Server(options);
} else {
    var http = require("http");
    var server = new http.Server();
}

var querystring = require("querystring");

var Request = require("./request");
var Response = require("./response");
var Metadata = require("./metadata");
var HttpHeader = require("./httpheader");
var ODataEntity = require("./entity/odataentity");
var Batch = require("./batch");


// var server = new http.Server();
function proc(request, response, fnCallback) {
    var queryData = "";
    if (typeof fnCallback !== 'function') return null;

    if (request.method == 'POST' || request.method == 'OPTIONS') {
        request.on('data', function (data) {
            queryData += data;
            if (queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                request.connection.destroy();
            }
        });

        request.on('end', function () {
            // request.get = querystring.parse(queryData);
            fnCallback(queryData);
        });

    } else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}

server.on("request", function (req, res) {
    var oUri = new Request(req);
    var oRes = new Response(res);
    var oHttpHeader = new HttpHeader();

    if (oUri.isFavicon()) {
        oRes.oConfig.oStatusCode.bAccepted = true;
        oRes.end();
        return;
    }

    if (oUri.sServiceName != oConfig.server.serviceName) {
        oRes.oConfig.oStatusCode.bNotFound = true;
        oRes.write("Page not found");
        oRes.end();
        return;
    }

    if (oUri.isOptions()) {
        oRes.end(oHttpHeader);
        return;
    }

    if (oUri.isError()) {
        oRes.oConfig.oStatusCode.bNotFound = true;
        oHttpHeader.oContentType.bJson = true;
        oRes.write(JSON.stringify(oUri.oError.getError()));
        oRes.end(oHttpHeader);
        return;
    }

    if(oUri.isHead()){
        oRes.oConfig.oStatusCode.bNotImplemented = true;
        oHttpHeader.oContentType.bJson = true;
        oRes.end(oHttpHeader);
        return;
    }

    if (oUri.isGet()) {
        if (oUri.isBatch()) {
            proc(req, res, function (sQueryData) {
                var oBatch = new Batch();
                oBatch.Parse(sQueryData);
                oBatch.getRequest(0);
                oRes.end(oHttpHeader);
            });
            return;
        }
        if (oUri.isServiceDescription()) {
            oHttpHeader.oContentType.bXml = true;
            var oMeta = new Metadata();
            oRes.write(oMeta.generateServiceDescription());
            oRes.end(oHttpHeader);
            return;
        }
        if (oUri.isMetadata()) {
            oHttpHeader.oContentType.bXml = true;

            var oMeta = new Metadata();
            oRes.write(oMeta.generate());
            oRes.end(oHttpHeader);
            return;
        }

        // var sEntityName = oUri.sEntitySetName; //(sEntitySetName.substring(0, sEntitySetName.length - 3)).toLocaleLowerCase();
        // console.log(sEntityName);

        if (oUri.sEntityName !== "") {
            var sEntityFile = oUri.sEntityName.toLowerCase();
            var oEntity = require("./entity/" + sEntityFile);
            oEntity = new oEntity();
            if (oEntity instanceof ODataEntity) {
                oEntity.getList({keys: oUri.aKeys, count: oUri.isCount()}, function (err, data) {
                    if (oUri.isCount()) {
                        oHttpHeader.oContentType.bText = true;
                    } else {
                        oHttpHeader.oContentType.bJson = true;
                    }
                    oRes.write(JSON.stringify(data));
                    oRes.end(oHttpHeader);
                });
                return;
            } else {
                res.statusCode = 500;
                res.end(sEntityName + " is not instance of ODataEntity");
                console.error(sEntityName + " is not instance of ODataEntity");
                return;
            }

        } else {
            return;
        }
    }

    if (oUri.isPost()) {
        if (oUri.isBatch()) {
            var that = this;
            that.iBatchCounter = 0;
            proc(req, res, function (sQueryData) {
                var oBatch = new Batch();
                oBatch.Parse(sQueryData);

                var i = 0;

                for (i = 0; i < oBatch.getRequestCount(); i++) {
                    var sEntityRequest = oBatch.getRequest(i);
                    var sUrl = "/" + oUri.sServiceName + "/" + sEntityRequest;
                    oUri.parseUrl(sUrl);
                    if (oUri.sEntityName !== "") {
                        var sEntityFile = oUri.sEntityName.toLowerCase();
                        var oEntity = require("./entity/" + sEntityFile);
                        oEntity = new oEntity();
                        if (oEntity instanceof ODataEntity) {
                            oEntity.getList({keys: oUri.aKeys, count: oUri.isCount()}, function (err, data, opt) {
                                that.iBatchCounter++;
                                var oHdr = {};
                                oHdr = new HttpHeader();
                                oHdr.oContentType.bHttp = true;
                                if (opt.count) {
                                    oHdr.oContentType2.bText = true;
                                } else {
                                    oHdr.oContentType2.bJson = true;
                                }
                                oHdr.oAccessControl.oAllow.sOrigin = "";
                                oHdr.oCacheControl.bNocache = true;
                                oHdr.oCacheControl.bPrivate = false;
                                oHdr.bContentTransferEncodingBinary = true;
                                oHdr.oAccessControl.oExpose.oHeaders.bAccessControlAllowOrigin = false;

                                oBatch.addResponse(oHdr, JSON.stringify(data));

                                if (that.iBatchCounter === oBatch.getRequestCount()) {
                                    oRes.write(oBatch.generateResponseBody());
                                    var oResHdr = new HttpHeader();
                                    oResHdr.oContentType.bMixed = true;
                                    oResHdr.oContentType.bHttp = false;
                                    oResHdr.oAccessControl.oAllow.sOrigin = "*";
                                    oResHdr.oAccessControl.oExpose.oHeaders.bAccessControlAllowOrigin = true;
                                    oResHdr.oCacheControl.bNocache = false;
                                    oResHdr.oCacheControl.bPrivate = true;
                                    oResHdr.bContentTransferEncodingBinary = true;
                                    oRes.oConfig.oStatusCode.bAccepted202 = true;
                                    oRes.end(oResHdr, oBatch.id);
                                    return;
                                }
                            });
                            continue;
                        } else {
                            continue;
                        }

                    }
                }

                // var sEntityRequest = oBatch.getRequest(0);
                // var sUrl = "/" + oUri.sServiceName + "/" + sEntityRequest;
                // oUri.parseUrl(sUrl);

                // if (oUri.sEntityName !== "") {
                //     var sEntityFile = oUri.sEntityName.toLowerCase();
                //     var oEntity = require("./entity/" + sEntityFile);
                //     oEntity = new oEntity();
                //     if (oEntity instanceof ODataEntity) {
                //         oEntity.getList({keys: oUri.aKeys, count: oUri.isCount()}, function (err, data) {
                //             var oHdr = new HttpHeader();
                //             if (oUri.isCount()) {
                //                 oHdr.oContentType.bText = true;
                //             } else {
                //                 oHdr.oContentType.bJson = true;
                //             }
                //             oBatch.addResponse(oHdr, JSON.stringify(data));
                //         });
                //         oRes.write(oBatch.generateResponseBody());
                //         oRes.end(oHttpHeader);
                //         return;
                //     } else {
                //         res.statusCode = 500;
                //         res.end(sEntityName + " is not instance of ODataEntity");
                //         console.error(sEntityName + " is not instance of ODataEntity");
                //         return;
                //     }
                //
                // }

                // oRes.end(oHttpHeader);
            });
            return;
        }
    }
    oRes.end();
});

server.listen(oConfig.server.port, oConfig.server.name);

