import * as mongoose from 'mongoose';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://srijanreddy98:affable98@ds155845.mlab.com:55845/affable', { useNewUrlParser: true });

export {mongoose};