"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var App_1 = require("./App");
var routes_1 = require("./Routes/routes");
var app = new App_1.default();
app.setRoutes(routes_1.routes);
app.serve();
//# sourceMappingURL=index.js.map