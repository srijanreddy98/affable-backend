import { Influencer } from '../db/models/models';
// import * as data from '../data.json';

let routes = (app) => {
    app.get('/api', (req, res) => {
        res.send('Server is up and running');
    });

    app.get('/api/influencers', (req, res) => {
        Influencer.find({}).sort([['followerCount', 'descending']]).skip(req.query.offset*10).limit(10).then(
            docs => res.send(docs),
            err => res.send(err)
        );
    });
    app.get('/api/interests', (req, res) => {
        Influencer.find({'stats.interests': req.query.interest}).sort([['followerCount', 'descending']]).skip(req.query.offset*10).limit(10).then(
            docs => res.send(docs),
            err => res.send(err)
        );
    });

// TODO: Merge /api/noInterests into this route
    app.post('/api/interests', (req, res) => {
        let desc = req.body.desc ? -1 : 1; 
        let pipeline = {
            "$project": {
                "stats.engagement.avgCommentsRatio": 1,
                "stats.engagement.avgLikesRatio": 1,
                "stats.interests": 1,
                "username": 1,
                "fullName": 1,
                "picture": 1,
                "biography": 1,
                "followerCount": 1,
                "comments": { "$multiply": [ "$stats.engagement.avgCommentsRatio", "$followerCount" ] },
                "likes": { "$multiply": [ "$stats.engagement.avgLikesRatio", "$followerCount" ] }
            }
        };
        //TODO: Lots of repeated code, make it DRY
        if (req.body.shouldContainOne) {
            if (req.body.sortBase == 0) {
                Influencer.find({'stats.interests': {$in: req.body.interests}}).sort([['followerCount', 'descending']]).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
            }
            if (req.body.sortBase == 1) {
                Influencer.aggregate([{$match:{'stats.interests': {$in: req.body.interests}}},pipeline,{"$sort": {"comments":desc}}]).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
            }
            if (req.body.sortBase == 2) {
                Influencer.aggregate([{$match:{'stats.interests': {$in: req.body.interests}}},pipeline, {"$sort": {"likes":desc}}]).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
                
            }
        }  else {
            if (req.body.sortBase == 0) {
                Influencer.find({'stats.interests': {$all: req.body.interests}}).sort([['followerCount', 'descending']]).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
            }
            if (req.body.sortBase == 1) {
                Influencer.aggregate([{$match:{'stats.interests': {$all: req.body.interests}}},pipeline, {"$sort": {"comments":desc}}]).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
            }
            if (req.body.sortBase == 2) {
                Influencer.aggregate([{$match:{'stats.interests': {$all: req.body.interests}}},pipeline, {"$sort": {"likes":desc}}]).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
            }
        }     
    });
    app.post('/api/noInterests', (req, res) => {
        let desc = req.body.desc ? -1 : 1; 
        let pipeline =
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
                    "comments": { "$multiply": [ "$stats.engagement.avgCommentsRatio", "$followerCount" ] },
                    "likes": { "$multiply": [ "$stats.engagement.avgLikesRatio", "$followerCount" ] }
                }
            };
        if (req.body.shouldContainOne) {
            if (req.body.sortBase == 0) {
                Influencer.find().sort([['followerCount', 'descending']]).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
            }
            if (req.body.sortBase == 1) {
                Influencer.aggregate([pipeline, {"$sort": {"comments":desc}}]).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
            }
            if (req.body.sortBase == 2) {
                Influencer.aggregate([pipeline,{"$sort": {"likes":desc}}]).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
                
            }
        }  else {
            if (req.body.sortBase == 0) {
                Influencer.find().sort([['followerCount', 'descending']]).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
            }
            if (req.body.sortBase == 1) {
                Influencer.aggregate([pipeline, {"$sort": {"comments":desc}}]).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
            }
            if (req.body.sortBase == 2) {
                Influencer.aggregate([pipeline, {"$sort": {"likes":desc}}]).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
            }
        }     
    });
    app.get('/api/allInterests', (req, res) => {
        Influencer.find().distinct('stats.interests').then(
            docs => res.send(docs.sort()),
            err => res.send(err)
        );
    })
    // app.get('/api/ok', async (req, res) => {
    //     Influencer.collection.insert(data).then(
    //         docs => res.send(docs),
    //         err => res.send(err)
    //     );
    // });
}

export {routes};