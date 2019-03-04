"use strict";
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
    // TODO: Merge /api/noInterests into this route
    app.post('/api/interests', function (req, res) {
        var desc = req.body.desc ? -1 : 1;
        var pipeline = {
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
        };
        //TODO: Lots of repeated code, make it DRY
        if (req.body.shouldContainOne) {
            if (req.body.sortBase == 0) {
                models_1.Influencer.find({ 'stats.interests': { $in: req.body.interests } }).sort([['followerCount', 'descending']]).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
            if (req.body.sortBase == 1) {
                models_1.Influencer.aggregate([{ $match: { 'stats.interests': { $in: req.body.interests } } }, pipeline, { "$sort": { "comments": desc } }]).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
            if (req.body.sortBase == 2) {
                models_1.Influencer.aggregate([{ $match: { 'stats.interests': { $in: req.body.interests } } }, pipeline, { "$sort": { "likes": desc } }]).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
        }
        else {
            if (req.body.sortBase == 0) {
                models_1.Influencer.find({ 'stats.interests': { $all: req.body.interests } }).sort([['followerCount', 'descending']]).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
            if (req.body.sortBase == 1) {
                models_1.Influencer.aggregate([{ $match: { 'stats.interests': { $all: req.body.interests } } }, pipeline, { "$sort": { "comments": desc } }]).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
            if (req.body.sortBase == 2) {
                models_1.Influencer.aggregate([{ $match: { 'stats.interests': { $all: req.body.interests } } }, pipeline, { "$sort": { "likes": desc } }]).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
        }
    });
    app.post('/api/noInterests', function (req, res) {
        var desc = req.body.desc ? -1 : 1;
        var pipeline = {
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
        };
        if (req.body.shouldContainOne) {
            if (req.body.sortBase == 0) {
                models_1.Influencer.find().sort([['followerCount', 'descending']]).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
            if (req.body.sortBase == 1) {
                models_1.Influencer.aggregate([pipeline, { "$sort": { "comments": desc } }]).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
            if (req.body.sortBase == 2) {
                models_1.Influencer.aggregate([pipeline, { "$sort": { "likes": desc } }]).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
        }
        else {
            if (req.body.sortBase == 0) {
                models_1.Influencer.find().sort([['followerCount', 'descending']]).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
            if (req.body.sortBase == 1) {
                models_1.Influencer.aggregate([pipeline, { "$sort": { "comments": desc } }]).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
            }
            if (req.body.sortBase == 2) {
                models_1.Influencer.aggregate([pipeline, { "$sort": { "likes": desc } }]).skip(req.query.offset * 10).limit(10).then(function (docs) { return res.send(docs); }, function (err) { return res.send(err); });
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
};
exports.routes = routes;
//# sourceMappingURL=routes.js.map