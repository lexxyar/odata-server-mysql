/**
 * Created by lexxy_000 on 19.09.2017.
 */

var fs = require("fs");
var path = require("path");
var XMLBuilder = require("xmlbuilder");
var config = require("./config");

Metadata = function () {
    /*
     https://www.sap.com/developer/tutorials/hcp-webide-create-odata-model.html
     */
    /*
     <?xml version="1.0" encoding="utf-8" standalone="yes"?>
     */
    /*
     <edmx:Edmx Version="1.0" xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx">
     */
    this.oNodes.oRoot = XMLBuilder.create("edmx:Edmx");
    this.oNodes.oRoot.att("xmlns:edmx", "http://schemas.microsoft.com/ado/2007/06/edmx")
        .att("Version", "1.0");

    /*
     <edmx:DataServices m:DataServiceVersion="2.0" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata">
     */
    this.oNodes.oDataServices = this.oNodes.oRoot.ele("edmx:DataServices");
    this.oNodes.oDataServices.att("m:DataServiceVersion", "2.0")
        .att("xmlns:m", "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata");

    /*
     <Schema Namespace="SalesModel" xmlns="http://schemas.microsoft.com/ado/2008/09/edm" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata">
     */
    this.oNodes.oSchema = this.oNodes.oDataServices.ele("Schema");
    this.oNodes.oSchema.att("xmlns", "http://schemas.microsoft.com/ado/2008/09/edm")
        .att("Namespace", config.global.modelName)
        .att("xmlns:d", "http://schemas.microsoft.com/ado/2007/08/dataservices")
        .att("xmlns:m", "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata");

    /*
     <EntityType Name="SalesOrder">
     <Key>
     <PropertyRef Name="SalesOrderKey"/>
     </Key>
     <Property Name="SalesOrderID" Type="Edm.String" MaxLength="10" />
     <Property Name="CreatedByEmployeeLastName" Type="Edm.String" MaxLength="40" />
     <Property Name="Status" Type="Edm.String" MaxLength="1" />
     <Property Name="ChangedByEmployeeLastName" Type="Edm.String" MaxLength="40" />
     <Property Name="ChangedByEmployeeUserID" Type="Edm.String" MaxLength="12" />
     <Property Name="NetSum" Type="Edm.Decimal" Precision="15" Scale="2" />
     <Property Name="CustomerKey" Type="Edm.String" MaxLength="32" />
     <Property Name="CreatedByEmployeeUserID" Type="Edm.String"  MaxLength="12" />
     <Property Name="DeliveryStatus" Type="Edm.String" MaxLength="1" />
     <Property Name="CurrencyCodeDescription" Type="Edm.String" MaxLength="255" />
     <Property Name="StatusDescription" Type="Edm.String" MaxLength="60" />
     <Property Name="ChangedByCustomerName" Type="Edm.String" MaxLength="80" />
     <Property Name="CreatedByEmployeeFirstName" Type="Edm.String" MaxLength="40" />
     <Property Name="DeliveryStatusDescription" Type="Edm.String" MaxLength="60" />
     <Property Name="Note" Type="Edm.String" MaxLength="255" />
     <Property Name="CreatedAt" Type="Edm.DateTime" Precision="7" />
     <Property Name="Tax" Type="Edm.Decimal" Precision="15" Scale="2" />
     <Property Name="TotalSum" Type="Edm.Decimal" Precision="15" Scale="2" />
     <Property Name="CreatedByCustomerName" Type="Edm.String" MaxLength="80" />
     <Property Name="ChangedByEmployeeFirstName" Type="Edm.String" MaxLength="40" />
     <Property Name="ChangedAt" Type="Edm.DateTime" Precision="7" />
     <Property Name="CustomerID" Type="Edm.String" MaxLength="10" />
     <Property Name="CustomerName" Type="Edm.String" MaxLength="80" />
     <Property Name="SalesOrderKey" Type="Edm.String" Nullable="false" MaxLength="32" />
     <Property Name="BillingStatus" Type="Edm.String" MaxLength="1" />
     <Property Name="BillingStatusDescription" Type="Edm.String" MaxLength="60" />
     <Property Name="Currency" Type="Edm.String" MaxLength="5" />
     </EntityType>
     */
    var aEntityFiles = this.readEntityDir();
    for (i in aEntityFiles) {
        var oEntityFile = aEntityFiles[i];
        var o = require(oEntityFile.path);
        this.oNodes.oSchema = (new o()).generateEntityType(this.oNodes.oSchema);
    }


    /*
     <EntityContainer Name="SalesEntities" m:IsDefaultEntityContainer="true" xmlns:p7="http://schemas.microsoft.com/ado/2009/02/edm/annotation">
     */
    this.oNodes.oEntityContainer = this.oNodes.oSchema.ele("EntityContainer");
    this.oNodes.oEntityContainer.att("Name", config.global.modelName + "Entities")
        .att("m:IsDefaultEntityContainer", "true")
        .att("xmlns:p7", "http://schemas.microsoft.com/ado/2009/02/edm/annotation");

    /*
     <EntitySet EntityType="SalesModel.SalesOrder" Name="SalesOrders"/>
     */
    for (i in aEntityFiles) {
        var oEntityFile = aEntityFiles[i];
        var o = require(oEntityFile.path);
        var a = new o();

        var oEntitySet = this.oNodes.oEntityContainer.ele("EntitySet");
        oEntitySet.att("EntityType", config.global.modelName + "." + a.metadata.name)
            .att("Name", a.metadata.name + "Set");
    }
};

Metadata.prototype = {
    oNodes: {
        oRoot: null,
        oDataServices: null,
        oSchema: null,
        oEntityContainer: null
    }
};

Metadata.prototype.readEntityDir = function () {
    var aEntityFiles = [];
    var sDir = __dirname + "\\entity";
    var files = fs.readdirSync(sDir);
    var i = 0;
    for (i in files) {
        var sFilePath = path.join(sDir, files[i]);
        var oStatus = fs.statSync(sFilePath);
        // console.log(oStatus);
        if (oStatus.isDirectory()) {
            continue;
        }
        if (oStatus.isFile()) {

            if (path.extname(files[i]) !== ".js") {
                continue;
            }
            if (path.basename(files[i], path.extname(files[i])) === "odataentity") {
                continue;
            }
            var sFileExtention = path.extname(files[i]);
            var sFileBaseName = path.basename(files[i], sFileExtention);
            var oEntityFile = {
                baseName: sFileBaseName,
                path: sFilePath
            }
            aEntityFiles.push(oEntityFile);
        }
    }
    return aEntityFiles;
}

Metadata.prototype.generate = function () {
    return this.oNodes.oRoot.end({pretty: true});
};

Metadata.prototype.generateServiceDescription = function () {
    /*
     <?xml version="1.0" encoding="utf-8" standalone="yes"?>
     */
    /*
     <service xml:base="http://services.odata.org/V2/Northwind/Northwind.svc/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:app="http://www.w3.org/2007/app"
     xmlns="http://www.w3.org/2007/app">
     */
    var oService = XMLBuilder.create("service");
    oService.att("xml:base", "http://services.odata.org/V2/Northwind/Northwind.svc/")
        .att("xmlns:atom", "http://www.w3.org/2005/Atom")
        .att("xmlns:app", "http://www.w3.org/2007/app")
        .att("xmlns", "http://www.w3.org/2007/app");
    /*
     <workspace>
     */
    var oWorkspace = oService.ele("workspace");
    /*
     <atom:title>Default</atom:title>
     */
    oWorkspace.ele("atom:title", {}, "Default");
    /*
     <collection href="Categories">
     */
    /*
     <atom:title>Categories</atom:title>
     */
    var aEntityFiles = this.readEntityDir();
    for (var i in aEntityFiles) {
        var oEntityFile = aEntityFiles[i];
        var o = require(oEntityFile.path);
        var a = new o();

        oWorkspace.ele("collection").att("href", a.metadata.name + "Set")
            .ele("atom:title", {}, a.metadata.name + "Set");
    }

    return oService.end({pretty: true});
}

module.exports = Metadata;