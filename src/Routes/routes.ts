import { Influencer } from '../db/models/models';
import * as data from '../data.json';

let generateFilterBasedQuery = (filters, offset) => {
    let sortBase = 'followerCount';
    if (filters.sortBase != 0) sortBase = filters.sortBase == 1 ? 'comments' : 'likes';
    let filter = filters.bio === '' ? {} : {biography: new RegExp(filters.bio + '*', 'i')};
    let sortFilter = filters.desc ? '-'+sortBase : sortBase;
    if (filters.interests.length == 0) return Influencer.find(filter).sort(sortFilter).skip(offset*10).limit(10);
    filter = { ...filter,  ...filters.shouldContainOne ? {'stats.interests': {$in: filters.interests}} : {'stats.interests': {$all: filters.interests}}};
    return Influencer.find(filter).sort(sortFilter).skip(offset*10).limit(10);
}

let routes = (app) => {
    app.get('/api', (req, res) => {
        res.send('Server is up and running');
    });
    app.post('/api/interests', async (req, res) => {
        const query = await generateFilterBasedQuery(req.body,req.query.offset);
        res.send(query);
    });
    app.get('/api/allInterests', (req, res) => {
        Influencer.find().distinct('stats.interests').then(
            docs => res.send(docs.sort()),
            err => res.send(err)
        );
    })
    app.get('/api/insertAllData', async (req, res) => {
        for (let i in data) {
            data[i]["comments"] = data[i].stats.engagement.avgCommentsRatio * data[i].followerCount;
            data[i]["likes"] = data[i].stats.engagement.avgLikesRatio * data[i].followerCount;
        }
        Influencer.collection.insert(data).then(
            docs => res.send(docs),
            err => res.send(err)
        );
    });
    app.get('/api/update', (req, res) => {
        Influencer.findOneAndUpdate({"_id" : '5c88a6f01947492a2bf6335c'}, {$set: {"followerCount": 311424017}}, {new: true}).then(
            doc => res.send(doc),
            err => res.send(err)
        );
    });
    app.get('/api/update2', (req, res) => {
        let regex = new RegExp('Light*', 'i');
        Influencer.find({biography: regex}).then(
            doc => res.send(doc),
            err => res.send(err)
        );
    });
}

export {routes};



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