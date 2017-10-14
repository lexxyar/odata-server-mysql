/**
 * Created by lexxy_000 on 26.06.2017.
 */
var db = require("./../db/index");
var oEntity = require("./odataentity");

Person = function () {

    oEntity.apply(this, arguments);

    var that = this;
    db.query("SELECT * FROM person", function (err, res, flds) {
        if (err) throw err;

        res.forEach(function (row) {
            flds.forEach(function (item) {
                that[item.name] = row[item.name];
            });
        });
    });

}

// Унаследовать
Person.prototype = Object.create(oEntity.prototype);

// Желательно и constructor сохранить
Person.prototype.constructor = Person;

Person.prototype.metadata = {
    name: "Person",
    fields: {
        id: {
            type: "integer",
            key: true,
            nullable: false
        },
        firstname: {
            type: "string",
            maxlength: 45
        },
        secondname: {
            type: "string",
            maxlength: 45
        },
        lastname: {
            type: "string",
            maxlength: 45
        },
        phone: {
            type: "string",
            maxlength: 45
        },
        mobile: {
            type: "string",
            maxlength: 45
        },
        city: {
            type: "string",
            maxlength: 20
        },
        position: {
            type: "string",
            maxlength: 80
        },
        positionfrs: {
            type: "string",
            maxlength: 80
        },
        persontype: {
            type: "string",
            maxlength: 45
        },
        permanentmoney: {
            type: "decimal",
            precision: 19,
            scale: 4
        },
        projectmoney: {
            type: "decimal",
            precision: 19,
            scale: 4
        }
    }
};

Person.prototype.getFirstName = function () {
    return this.name2;
};
Person.prototype.getLastName = function () {
    return this.name1;
};
Person.prototype.getMiddleName = function () {
    return this.name3;
};

Person.prototype.getData = function (/*oResponse*/) {
    // var personArray = [];
    // console.log("getData");
    db.query("SELECT * FROM v_person", function (err, res, flds) {
        if (err) {
            console.error("Get person error");
            throw err;
        }

        var r = {"d": {"results": res}};

        console.log(r);
        // oResponse.addHeader("Content-Length", Buffer.byteLength(res));
        // oResponse.end(oDataFormatter.format(r));
        return r;
    });

};

//noinspection JSAnnotator
Person.prototype.getList = function (oOptions, fnCallback) {
    // var personArray = [];
    // var data;

    var aWhere = [];
    if (typeof (oOptions.keys) !== undefined) {
        for (var i = 0; i < oOptions.keys.length; i++) {
            var oKey = oOptions.keys[i];
            aWhere.push("`" + oKey.field + "`=" + oKey.value);
        }
    }

    var bCount = (typeof (oOptions.count) === undefined) ? false : oOptions.count;

    var sWhere = "";
    if (aWhere.length > 0) {
        sWhere = " WHERE " + aWhere.join(" and ");
    }

    var sSql = "SELECT * FROM v_person" + sWhere;

    if (bCount) {
        sSql = "SELECT COUNT(*) AS __count FROM (" + sSql + ") AS counted";
    }
// console.log(sSql);

    db.query(sSql, function (err, res) {
        var data;
        if (err) {
            console.error("Get person error");
        } else {
            if (bCount) {
                data = res[0].__count;
            } else {
                data = {"d": {"results": res}};
                data = {"d": res};
            }
        }
        fnCallback(err, data, oOptions);

    });
};

module.exports = Person;