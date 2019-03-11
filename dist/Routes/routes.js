"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../db/models/models");
var data = require("../data.json");
var generateFilterBasedQuery = function (filters, offset) {
    var sortBase = 'followerCount';
    if (filters.sortBase != 0)
        sortBase = filters.sortBase == 1 ? 'comments' : 'likes';
    var sortFilter = filters.desc ? '-' + sortBase : sortBase;
    if (filters.interests.length == 0)
        return models_1.Influencer.find({}).sort(sortFilter).skip(offset * 10).limit(10);
    var interestFilter = filters.shouldContainOne ? { 'stats.interests': { $in: filters.interests } } : { 'stats.interests': { $all: filters.interests } };
    return models_1.Influencer.find(interestFilter).sort(sortFilter).skip(offset * 10).limit(10);
};
var routes = function (app) {
    app.get('/api', function (req, res) {
        res.send('Server is up and running');
    });
    app.get('/api/interests', function (req, res) {
        models_1.Influencer.find({ 'stats.interests': req.query.interest }).sort([['followerCount', 'descending']]).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
    });
    app.post('/api/interests', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generateFilterBasedQuery(req.body, req.query.offset)];
                case 1:
                    query = _a.sent();
                    res.send(query);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get('/api/allInterests', function (req, res) {
        models_1.Influencer.find().distinct('stats.interests').then(function (docs) { return res.send(docs.sort()); }, function (err) { return res.send(err); });
    });
    app.get('/api/insertAllData', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            for (i in data) {
                data[i]["comments"] = data[i].stats.engagement.avgCommentsRatio * data[i].followerCount;
                data[i]["likes"] = data[i].stats.engagement.avgLikesRatio * data[i].followerCount;
            }
            models_1.Influencer.collection.insert(data).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            return [2 /*return*/];
        });
    }); });
    app.get('/api/update', function (req, res) {
        models_1.Influencer.findOneAndUpdate({ "_id": '5c8482f6f94fb92fdb8e5857' }, { $set: { "followerCount": 311424017 } }, { new: true }).then(function (doc) { return res.send(doc); }, function (err) { return res.send(err); });
    });
};
exports.routes = routes;
// TODO: Merge /api/noInterests into this route
// app.post('/api/interests', (req, res) => {
//     let desc = req.body.desc ? -1 : 1; 
//     let pipeline = {
//         "$project": {
//             "stats.engagement.avgCommentsRatio": 1,
//             "stats.engagement.avgLikesRatio": 1,
//             "stats.interests": 1,
//             "username": 1,
//             "fullName": 1,
//             "picture": 1,
//             "biography": 1,
//             "followerCount": 1,
//             "comments": { "$multiply": [ "$stats.engagement.avgCommentsRatio", "$followerCount" ] },
//             "likes": { "$multiply": [ "$stats.engagement.avgLikesRatio", "$followerCount" ] }
//         }
//     };
//     //TODO: Lots of repeated code, make it DRY
//     if (req.body.shouldContainOne) {
//         if (req.body.sortBase == 0) {
//             Influencer.find({'stats.interests': {$in: req.body.interests}}).sort([['followerCount', 'descending']]).skip(req.query.offset*10).limit(10).then(
//                 docs => res.send(docs),
//                 err => res.send(err)
//             );
//         }
//         if (req.body.sortBase == 1) {
//             Influencer.aggregate([{$match:{'stats.interests': {$in: req.body.interests}}},pipeline,{"$sort": {"comments":desc}}]).skip(req.query.offset*10).limit(10).then(
//                 docs => res.send(docs),
//                 err => res.send(err)
//             );
//         }
//         if (req.body.sortBase == 2) {
//             Influencer.aggregate([{$match:{'stats.interests': {$in: req.body.interests}}},pipeline, {"$sort": {"likes":desc}}]).skip(req.query.offset*10).limit(10).then(
//                 docs => res.send(docs),
//                 err => res.send(err)
//             );
//         }
//     }  else {
//         if (req.body.sortBase == 0) {
//             Influencer.find({'stats.interests': {$all: req.body.interests}}).sort([['followerCount', 'descending']]).skip(req.query.offset*10).limit(10).then(
//                 docs => res.send(docs),
//                 err => res.send(err)
//             );
//         }
//         if (req.body.sortBase == 1) {
//             Influencer.aggregate([{$match:{'stats.interests': {$all: req.body.interests}}},pipeline, {"$sort": {"comments":desc}}]).skip(req.query.offset*10).limit(10).then(
//                 docs => res.send(docs),
//                 err => res.send(err)
//             );
//         }
//         if (req.body.sortBase == 2) {
//             Influencer.aggregate([{$match:{'stats.interests': {$all: req.body.interests}}},pipeline, {"$sort": {"likes":desc}}]).skip(req.query.offset*10).limit(10).then(
//                 docs => res.send(docs),
//                 err => res.send(err)
//             );
//         }
//     }     
// });
// app.post('/api/noInterests', (req, res) => {
//     let desc = req.body.desc ? -1 : 1; 
//     let pipeline =
//         {
//             "$project": {
//                 "stats.engagement.avgCommentsRatio": 1,
//                 "stats.engagement.avgLikesRatio": 1,
//                 "stats.interests": 1,
//                 "username": 1,
//                 "fullName": 1,
//                 "picture": 1,
//                 "biography": 1,
//                 "followerCount": 1,
//                 "comments": { "$multiply": [ "$stats.engagement.avgCommentsRatio", "$followerCount" ] },
//                 "likes": { "$multiply": [ "$stats.engagement.avgLikesRatio", "$followerCount" ] }
//             }
//         };
//     if (req.body.shouldContainOne) {
//         if (req.body.sortBase == 0) {
//             Influencer.find().sort([['followerCount', 'descending']]).skip(req.query.offset*10).limit(10).then(
//                 docs => res.send(docs),
//                 err => res.send(err)
//             );
//         }
//         if (req.body.sortBase == 1) {
//             Influencer.aggregate([pipeline, {"$sort": {"comments":desc}}]).skip(req.query.offset*10).limit(10).then(
//                 docs => res.send(docs),
//                 err => res.send(err)
//             );
//         }
//         if (req.body.sortBase == 2) {
//             Influencer.aggregate([pipeline,{"$sort": {"likes":desc}}]).skip(req.query.offset*10).limit(10).then(
//                 docs => res.send(docs),
//                 err => res.send(err)
//             );
//         }
//     }  else {
//         if (req.body.sortBase == 0) {
//             Influencer.find().sort([['followerCount', 'descending']]).skip(req.query.offset*10).limit(10).then(
//                 docs => res.send(docs),
//                 err => res.send(err)
//             );
//         }
//         if (req.body.sortBase == 1) {
//             Influencer.aggregate([pipeline, {"$sort": {"comments":desc}}]).skip(req.query.offset*10).limit(10).then(
//                 docs => res.send(docs),
//                 err => res.send(err)
//             );
//         }
//         if (req.body.sortBase == 2) {
//             Influencer.aggregate([pipeline, {"$sort": {"likes":desc}}]).skip(req.query.offset*10).limit(10).then(
//                 docs => res.send(docs),
//                 err => res.send(err)
//             );
//         }
//     }     
// });
//# sourceMappingURL=routes.js.map