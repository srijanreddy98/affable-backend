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
        interests: [String]
    },
    engagement: {
        avgCommentsRatio: Number,
        avgLikesRatio: Number
    }
});
var Influencer = db_1.mongoose.model('influencer', influencerSchema);
exports.Influencer = Influencer;
//# sourceMappingURL=models.js.map