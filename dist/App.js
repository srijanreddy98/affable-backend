"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var App = /** @class */ (function () {
    function App() {
        this.app = express();
        this.app.use(bodyParser.json({
            parameterLimit: 1000000,
            limit: '50mb',
            extended: true
        }));
        this.app.use(bodyParser.urlencoded({
            parameterLimit: 1000000,
            limit: '50mb',
            extended: true
        }));
    }
    App.prototype.serve = function () {
        var port = process.env.PORT || 3000;
        this.app.listen(port, function () { return console.log("Server is up and on port " + port); });
    };
    App.prototype.setRoutes = function (routes) {
        routes(this.app);
        this.app.use(express.static(__dirname + '/frontend'));
        this.app.get('/*', function (req, res) {
            res.sendFile(path.join(__dirname + '/frontend', 'index.html'));
        });
    };
    return App;
}());
exports.default = App;
//# sourceMappingURL=App.js.map