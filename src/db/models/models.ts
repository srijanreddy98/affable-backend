import { mongoose } from "../db";
const { Schema } = mongoose;

const influencerSchema = new Schema({
    username: {
        type: String,
        default: null
    },
    fullName: {
        type: String,
        default: null
    },
    picture: {
        type:String,
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

let Influencer = mongoose.model('influencer', influencerSchema);

export {Influencer}