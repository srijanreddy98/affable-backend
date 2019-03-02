"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
exports.mongoose = mongoose;
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://srijanreddy98:affable98@ds155845.mlab.com:55845/affable', { useNewUrlParser: true });
//# sourceMappingURL=db.js.map