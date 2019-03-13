"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("../db");
var Schema = db_1.mongoose.Schema;
var influencerSchema = new Schema({
    username: {
        type: String,
        default: null
    },
    fullName: {
        type: String,
        default: null
    },
    picture: {
        type: String,
        default: null
    },
    biography: {
        type: String,
        default: null
    },
    followerCount: Number,
    stats: {
        followerCount: Number,
        interests: [String],
        engagement: {
            avgCommentsRatio: Number,
            avgLikesRatio: Number
        },
    },
    comments: Number,
    likes: Number
});
influencerSchema.post('findOneAndUpdate', function (dc, next) {
    var _this = this;
    if (this._update.$set.followerCount || this._update.$set.stats) {
        Influencer.findOne(this._conditions).then(function (doc) {
            var likes = doc.followerCount * doc.stats.engagement.avgLikesRatio;
            var comments = doc.followerCount * doc.stats.engagement.avgCommentsRatio;
            Influencer.findOneAndUpdate(_this._conditions, { $set: { likes: likes, comments: comments } }).then(function (docs) { return docs; }, function (err) { return console.log(err); });
        }, function (err) { return console.log(err); });
    }
});
var Influencer = db_1.mongoose.model('influencer', influencerSchema);
exports.Influencer = Influencer;
//# sourceMappingURL=models.js.map