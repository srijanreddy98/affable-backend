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
    if (this._update.$set.followerCount || this._update.$set.stats) {
        Influencer.findOne(this._conditions).then(
            doc => {
                const likes = doc.followerCount * doc.stats.engagement.avgLikesRatio;
                const comments = doc.followerCount * doc.stats.engagement.avgCommentsRatio;
                Influencer.findOneAndUpdate(this._conditions, {$set: {likes, comments}}).then(
                    docs => docs,
                    err => console.log(err)
                );
            },
            err => console.log(err)
        );
    }
})
let Influencer = mongoose.model('influencer', influencerSchema);

export {Influencer}
 