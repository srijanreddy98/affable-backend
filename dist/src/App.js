"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
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
        this.app.listen(3000, function () { return console.log('Server is up and on port 3000'); });
    };
    App.prototype.setRoutes = function (routes) {
        routes(this.app);
    };
    return App;
}());
exports.default = App;
//# sourceMappingURL=App.js.map