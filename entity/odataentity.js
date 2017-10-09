/**
 * Created by lexxy_000 on 29.06.2017.
 */

ODataEntity = function () {

};

ODataEntity.prototype = {
    metadata:{},
    oError: null
};

ODataEntity.prototype.isError = function () {
    return oError === null;
};

ODataEntity.prototype.getByKey = function (aKeyValue) {

};

ODataEntity.prototype.getList = function (oOptions, fnCallback) {

};

ODataEntity.prototype.generateEntityType = function (oSchema) {
    var oEntityType = oSchema.ele("EntityType");
    oEntityType.att("Name", this.metadata.name);

    var flds = this.metadata.fields;
    var aKeys = [];
    var aProps = [];
    for (var sPropertyName in flds) {
        if (flds[sPropertyName].key !== undefined && flds[sPropertyName].key === true) {
            aKeys.push(sPropertyName);
        }
        var oProperty = {};
        oProperty.Name = sPropertyName;
        var sEdmType = "Edm.";
        switch (flds[sPropertyName].type) {
            case "integer":
                sEdmType += "Int32";
                break;
            case "decimal":
                sEdmType += "Decimal";
                break;
            default:
                sEdmType += "String";
                break;
        }
        oProperty.Type = sEdmType;
        if (flds[sPropertyName].nullable !== undefined) {
            oProperty.Nullable = flds[sPropertyName].nullable;
        }

        if (flds[sPropertyName].maxlength !== undefined) {
            oProperty.MaxLength = flds[sPropertyName].maxlength;
        }

        if (flds[sPropertyName].precision !== undefined) {
            oProperty.Precision = flds[sPropertyName].precision;
        }

        if (flds[sPropertyName].scale !== undefined) {
            oProperty.Scale = flds[sPropertyName].scale;

        }
        aProps.push(oProperty);

    }

    var i;
    var oKey = oEntityType.ele("Key");
    for (i = 0; i < aKeys.length; i++) {
        var oPropertyRef = oKey.ele("PropertyRef");
        oPropertyRef.att("Name", aKeys[i]);
    }

    for (i = 0; i < aProps.length; i++) {
        oEntityType.ele("Property", aProps[i]);
    }
    return oSchema;
}


module.exports = ODataEntity;