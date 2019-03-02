import { mongoose } from '../db/db';
import { Influencer } from '../db/models/models';
// import * as data from '../data.json';
import * as fs from 'fs';
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
    app.post('/api/interests', (req, res) => {
        let desc = req.body.desc ? -1 : 1; 
        let pipeline1 =  [
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
            },
            {
                "$sort": {"comments":desc}
            }            
        ];
        let pipeline2 =  [
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
            },
            {
                "$sort": {"likes":desc}
            }            
        ];
        if (req.body.shouldContainOne) {
            if (req.body.sortBase == 0) {
                // console.log(1);
                Influencer.find({'stats.interests': {$in: req.body.interests}}).sort([['followerCount', 'descending']]).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
            }
            if (req.body.sortBase == 1) {
                // console.log(2);
                Influencer.aggregate([{$match:{'stats.interests': {$in: req.body.interests}}},...pipeline1]).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
            }
            if (req.body.sortBase == 2) {
                // console.log(3);
                Influencer.aggregate([{$match:{'stats.interests': {$in: req.body.interests}}},...pipeline2]).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
                
            }
        }  else {
            if (req.body.sortBase == 0) {
                // console.log(4);
                Influencer.find({'stats.interests': {$all: req.body.interests}}).sort([['followerCount', 'descending']]).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
            }
            if (req.body.sortBase == 1) {
                // console.log(5);
                Influencer.aggregate([{$match:{'stats.interests': {$all: req.body.interests}}},...pipeline1]).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
            }
            if (req.body.sortBase == 2) {
                // console.log(6);
                Influencer.aggregate([{$match:{'stats.interests': {$all: req.body.interests}}},...pipeline2]).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
            }
        }     
    });
    app.post('/api/noInterests', (req, res) => {
        let desc = req.body.desc ? -1 : 1; 
        let pipeline1 =  [
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
            },
            {
                "$sort": {"comments":desc}
            }            
        ];
        let pipeline2 =  [
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
            },
            {
                "$sort": {"likes":desc}
            }            
        ];
        if (req.body.shouldContainOne) {
            if (req.body.sortBase == 0) {
                // console.log(1);
                Influencer.find().sort([['followerCount', 'descending']]).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
            }
            if (req.body.sortBase == 1) {
                // console.log(2);
                Influencer.aggregate(pipeline1).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
            }
            if (req.body.sortBase == 2) {
                // console.log(3);
                Influencer.aggregate(pipeline2).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
                
            }
        }  else {
            if (req.body.sortBase == 0) {
                // console.log(4);
                Influencer.find().sort([['followerCount', 'descending']]).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
            }
            if (req.body.sortBase == 1) {
                // console.log(5);
                Influencer.aggregate(pipeline1).skip(req.query.offset*10).limit(10).then(
                    docs => res.send(docs),
                    err => res.send(err)
                );
            }
            if (req.body.sortBase == 2) {
                // console.log(6);
                Influencer.aggregate(pipeline2).skip(req.query.offset*10).limit(10).then(
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
    app.get('/api/check', (req, res) => {
        let pipeline =  [
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
                    "comments": { "$multiply": [ "$stats.engagement.avgCommentsRatio", "$followerCount" ] },
                    "likes": { "$multiply": [ "$stats.engagement.avgLikesRatio", "$followerCount" ] }
                }
            },
            {
                "$sort": {"likes":-1}
            }            
        ];
    Influencer.aggregate(pipeline).then(
        docs => res.send(docs),
        err => res.send(err)
    );
    });
}

export {routes};