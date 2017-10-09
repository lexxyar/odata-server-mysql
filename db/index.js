var mysql = require("mysql");
var config = require("./../config");

var client = module.exports = mysql.createConnection(config.mysql);
client.connect(function (err) {
    if (err) throw err;
    // console.log("Connected!");
});

// exports.connect = function () {
//     DbCon.connect(function (err) {
//         if (err) throw err;
//         console.log("Connected!");
//     });
// };
// module.exports = DbCon;