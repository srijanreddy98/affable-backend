"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../db/models/models");
// import * as data from '../data.json';
var routes = function (app) {
    app.get('/api', function (req, res) {
        res.send('Server is up and running');
    });
    app.get('/api/influencers', function (req, res) {
        models_1.Influencer.find({}).sort([['followerCount', 'descending']]).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
    });
    app.get('/api/interests', function (req, res) {
        models_1.Influencer.find({ 'stats.interests': req.query.interest }).sort([['followerCount', 'descending']]).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
    });
    app.post('/api/interests', function (req, res) {
        var desc = req.body.desc ? -1 : 1;
        var pipeline1 = [
            {
                "$project": {
                    "stats.engagement.avgCommentsRatio": 1,
                    "stats.engagement.avgLikesRatio": 1,
                    "stats.interests": 1,
                    "username": 1,
                    "fullName": 1,
                    "picture": 1,
                    "biography": 1,
                    "followerCount": 1,
                    "comments": { "$multiply": ["$stats.engagement.avgCommentsRatio", "$followerCount"] },
                    "likes": { "$multiply": ["$stats.engagement.avgLikesRatio", "$followerCount"] }
                }
            },
            {
                "$sort": { "comments": desc }
            }
        ];
        var pipeline2 = [
            {
                "$project": {
                    "stats.engagement.avgCommentsRatio": 1,
                    "stats.engagement.avgLikesRatio": 1,
                    "stats.interests": 1,
                    "username": 1,
                    "fullName": 1,
                    "picture": 1,
                    "biography": 1,
                    "followerCount": 1,
                    "comments": { "$multiply": ["$stats.engagement.avgCommentsRatio", "$followerCount"] },
                    "likes": { "$multiply": ["$stats.engagement.avgLikesRatio", "$followerCount"] }
                }
            },
            {
                "$sort": { "likes": desc }
            }
        ];
        if (req.body.shouldContainOne) {
            if (req.body.sortBase == 0) {
                // console.log(1);
                models_1.Influencer.find({ 'stats.interests': { $in: req.body.interests } }).sort([['followerCount', 'descending']]).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
            if (req.body.sortBase == 1) {
                // console.log(2);
                models_1.Influencer.aggregate(__spread([{ $match: { 'stats.interests': { $in: req.body.interests } } }], pipeline1)).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
            if (req.body.sortBase == 2) {
                // console.log(3);
                models_1.Influencer.aggregate(__spread([{ $match: { 'stats.interests': { $in: req.body.interests } } }], pipeline2)).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
        }
        else {
            if (req.body.sortBase == 0) {
                // console.log(4);
                models_1.Influencer.find({ 'stats.interests': { $all: req.body.interests } }).sort([['followerCount', 'descending']]).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
            if (req.body.sortBase == 1) {
                // console.log(5);
                models_1.Influencer.aggregate(__spread([{ $match: { 'stats.interests': { $all: req.body.interests } } }], pipeline1)).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
            if (req.body.sortBase == 2) {
                // console.log(6);
                models_1.Influencer.aggregate(__spread([{ $match: { 'stats.interests': { $all: req.body.interests } } }], pipeline2)).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
        }
    });
    app.post('/api/noInterests', function (req, res) {
        var desc = req.body.desc ? -1 : 1;
        var pipeline1 = [
            {
                "$project": {
                    "stats.engagement.avgCommentsRatio": 1,
                    "stats.engagement.avgLikesRatio": 1,
                    "stats.interests": 1,
                    "username": 1,
                    "fullName": 1,
                    "picture": 1,
                    "biography": 1,
                    "followerCount": 1,
                    "comments": { "$multiply": ["$stats.engagement.avgCommentsRatio", "$followerCount"] },
                    "likes": { "$multiply": ["$stats.engagement.avgLikesRatio", "$followerCount"] }
                }
            },
            {
                "$sort": { "comments": desc }
            }
        ];
        var pipeline2 = [
            {
                "$project": {
                    "stats.engagement.avgCommentsRatio": 1,
                    "stats.engagement.avgLikesRatio": 1,
                    "stats.interests": 1,
                    "username": 1,
                    "fullName": 1,
                    "picture": 1,
                    "biography": 1,
                    "followerCount": 1,
                    "comments": { "$multiply": ["$stats.engagement.avgCommentsRatio", "$followerCount"] },
                    "likes": { "$multiply": ["$stats.engagement.avgLikesRatio", "$followerCount"] }
                }
            },
            {
                "$sort": { "likes": desc }
            }
        ];
        if (req.body.shouldContainOne) {
            if (req.body.sortBase == 0) {
                // console.log(1);
                models_1.Influencer.find().sort([['followerCount', 'descending']]).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
            if (req.body.sortBase == 1) {
                // console.log(2);
                models_1.Influencer.aggregate(pipeline1).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
            if (req.body.sortBase == 2) {
                // console.log(3);
                models_1.Influencer.aggregate(pipeline2).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
        }
        else {
            if (req.body.sortBase == 0) {
                // console.log(4);
                models_1.Influencer.find().sort([['followerCount', 'descending']]).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
            if (req.body.sortBase == 1) {
                // console.log(5);
                models_1.Influencer.aggregate(pipeline1).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
            if (req.body.sortBase == 2) {
                // console.log(6);
                models_1.Influencer.aggregate(pipeline2).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
        }
    });
    app.get('/api/allInterests', function (req, res) {
        models_1.Influencer.find().distinct('stats.interests').then(function (docs) { return res.send(docs.sort()); }, function (err) { return res.send(err); });
    });
    // app.get('/api/ok', async (req, res) => {
    //     Influencer.collection.insert(data).then(
    //         docs => res.send(docs),
    //         err => res.send(err)
    //     );
    // });
    app.get('/api/check', function (req, res) {
        var pipeline = [
            {
                "$project": {
                    "stats.engagement.avgCommentsRatio": 1,
                    "stats.engagement.avgLikesRatio": 1,
                    "stats.interest": 1,
                    "username": 1,
                    "fullName": 1,
                    "picture": 1,
                    "biography": 1,
                    "followerCount": 1,
                    "comments": { "$multiply": ["$stats.engagement.avgCommentsRatio", "$followerCount"] },
                    "likes": { "$multiply": ["$stats.engagement.avgLikesRatio", "$followerCount"] }
                }
            },
            {
                "$sort": { "likes": -1 }
            }
        ];
        models_1.Influencer.aggregate(pipeline).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
    });
};
exports.routes = routes;
//# sourceMappingURL=routes.js.map