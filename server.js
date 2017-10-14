var oConfig = require("./config.json");
var oConst = require("./constants.json");

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
    server = new http.Server();
}

var querystring = require("querystring");

var Request = require("./request");
var Response = require("./response");
var Metadata = require("./metadata");
var HttpHeader = require("./httpheader");
var ODataEntity = require("./entity/odataentity");
var Batch = require("./batch");
var BatchResponse = require("./batchresponse");
var BatchItem = require("./batchitem");


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
    res.statusCode = 200;
    var oUri = new Request(req);
    var oRes = new Response(res);
    var oHttpHeader = new HttpHeader();

    if (oUri.isFavicon()) {
        oRes.setStatusCode(oConst.StatusCode.Accepted);
        oRes.end();
        return;
    }

    if (oUri.sServiceName != oConfig.server.serviceName) {
        oRes.setStatusCode(oConst.StatusCode.NotFound);
        oRes.write("Page not found");
        oRes.end();
        return;
    }

    if (oUri.isOptions()) {
        oHttpHeader = new HttpHeader();
        oHttpHeader.setAccessControlAllowOrigin("*");
        oHttpHeader.setAccessControlAllowHeaders([
            oConst.AccessControlHeader.SapContextidAccept,
            oConst.AccessControlHeader.MaxDataServiceVersion,
            oConst.AccessControlHeader.XCsrfToken,
            oConst.AccessControlHeader.ContentType,
            oConst.AccessControlHeader.DataServiceVersion,
            oConst.AccessControlHeader.SapCancelOnClose
        ]);

        // For Bathch
        // if (oUri.isBatch()) {
        //     oHttpHeader.setAccessControlAllowHeaders([oConst.AccessControlHeader.XCsrfToken, oConst.AccessControlHeader.DataServiceVersion]);
        // }

        oRes.setStatusCode(oConst.StatusCode.OK);
        oRes.end(oHttpHeader);
        return;
    }

    if (oUri.isError()) {
        oHttpHeader = new HttpHeader();
        oRes.setStatusCode(oConst.StatusCode.NotFound);
        oHttpHeader.setContentType(oConst.ContentType.Json);
        oRes.write(JSON.stringify(oUri.oError.getError()));
        oRes.end(oHttpHeader);
        return;
    }

    if(oUri.isHead()){
        oHttpHeader = new HttpHeader();
        oRes.setStatusCode(oConst.StatusCode.NotImplemented);
        oHttpHeader.setContentType(oConst.ContentType.Json);
        oRes.end(oHttpHeader);
        return;
    }

    if (oUri.isGet()) {
        if (oUri.isServiceDescription()) {
            oHttpHeader = new HttpHeader();
            oRes.setStatusCode(oConst.StatusCode.OK);
            oHttpHeader.setContentType(oConst.ContentType.Xml);
            oHttpHeader.setAccessControlAllowOrigin("*");
            var oMeta = new Metadata();
            oRes.write(oMeta.generateServiceDescription());
            oRes.end(oHttpHeader);
            return;
        }
        if (oUri.isMetadata()) {
            oHttpHeader = new HttpHeader();
            oRes.setStatusCode(oConst.StatusCode.OK);
            oHttpHeader.setContentType(oConst.ContentType.Xml);
            oHttpHeader.setAccessControlAllowOrigin("*");

            var oMeta = new Metadata();
            oRes.write(oMeta.generate());
            oRes.end(oHttpHeader);
            return;
        }

        if (oUri.sEntityName !== "") {
            oHttpHeader = new HttpHeader();
            var sEntityFile = oUri.sEntityName.toLowerCase();
            var oEntity = require("./entity/" + sEntityFile);
            oEntity = new oEntity();
            if (oEntity instanceof ODataEntity) {
                oEntity.getList({keys: oUri.aKeys, count: oUri.isCount()}, function (err, data) {
                    oHttpHeader.setAccessControlAllowOrigin("*");
                    if (oUri.isCount()) {
                        oHttpHeader.setContentType(oConst.ContentType.Text);
                    } else {
                        oHttpHeader.setContentType(oConst.ContentType.Json);
                        oHttpHeader.setContentTypeCharset("utf-8");
                    }
                    oRes.write(JSON.stringify(data));
                    oRes.end(oHttpHeader);
                });
                return;
            } else {
                oRes.setStatusCode(oConst.StatusCode.InternalServerError);
                oRes.write(sEntityName + " is not instance of ODataEntity");
                oRes.end();
                return;
            }

        } else {
            oRes.setStatusCode(oConst.StatusCode.InternalServerError);
            oRes.write("Entity Name is empty");
            oRes.end();
            return;
        }
    }

    if (oUri.isPost()) {
        if (oUri.isBatch()) {
            var that = this;
            that.iBatchCounter = 0;

            var oBatchResp = new BatchResponse();
            var oHdr = new HttpHeader();
            oHdr.setContentType(oConst.ContentType.Http);
            oHdr.setContentTransferEncoding(oConst.ContentTransferEncoding.Binary);
            oHdr.setCacheControl([oConst.CacheControl.Nocache]);
            oBatchResp.setCommonHeader(oHdr);

            proc(req, res, function (sQueryData) {
                var oBatch = new Batch();
                oBatch.Parse(sQueryData);

                for (var i = 0; i < oBatch.getRequestCount(); i++) {
                    var sEntityRequest = oBatch.getRequest(i);
                    var sUrl = "/" + oUri.sServiceName + "/" + sEntityRequest;
                    oUri.parseUrl(sUrl);
                    if (oUri.sEntityName !== "") {
                        var sEntityFile = oUri.sEntityName.toLowerCase();
                        var oEntity = require("./entity/" + sEntityFile);
                        oEntity = new oEntity();

                        // var oBatchResp = new BatchResponse();
                        // var oHdr = new HttpHeader();
                        // oHdr.setContentType(oConst.ContentType.Http);
                        // oHdr.setContentTransferEncoding(oConst.ContentTransferEncoding.Binary);
                        // oBatchResp.setCommonHeader(oHdr);

                        if (oEntity instanceof ODataEntity) {
                            oEntity.getList({keys: oUri.aKeys, count: oUri.isCount()}, function (err, data, opt) {
                                that.iBatchCounter++;

                                var oBatchItem = new BatchItem();
                                oBatchItem.setStatusCode(oConst.StatusCode.OK);

                                oHdr = new HttpHeader();
                                oHdr.setAccessControlAllowOrigin("*");
                                oHdr.calculateContentLength(JSON.stringify(data));
                                oHdr.setContentTypeCharset("utf-8");
                                oHdr.setDataServiceVersion(oConfig.server.dataServiceVersion);
                                if (opt.count) {
                                    oHdr.setContentType(oConst.ContentType.Text);
                                } else {
                                    oHdr.setContentType(oConst.ContentType.Json);
                                }
                                // oHdr.setCacheControl([oConst.CacheControl.Nocache]);
                                // oHdr.setContentTransferEncoding(oConst.ContentTransferEncoding.Binary);
                                // oHdr.setAccessControlExposeHeaders([oConst.AccessControlHeader.AccessControlAllowOrigin]);
                                oBatchItem.setHeader(oHdr);
                                oBatchItem.setContent(JSON.stringify(data));
                                oBatchResp.addItem(oBatchItem);
                                // oBatch.addResponse(oHdr, JSON.stringify(data));

                                if (that.iBatchCounter === oBatch.getRequestCount()) {
                                    var oResHdr = new HttpHeader();
                                    oRes.setStatusCode(oConst.StatusCode.Accepted);
                                    oResHdr.setDataServiceVersion(oConfig.server.dataServiceVersion);
                                    oResHdr.setContentType(oConst.ContentType.Mixed);
                                    oResHdr.setBatchId(oBatchResp.getId());
                                    oResHdr.setAccessControlAllowOrigin("*");
                                    oRes.write(oBatchResp.toString());
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
            });
            return;
        }
    }

    oRes.end();
});

server.listen(oConfig.server.port, oConfig.server.name);

