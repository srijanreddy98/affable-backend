import { Influencer } from './src/db/models/models';
let fn1 = async () => {
    const a1 = await Influencer.find({});
    console.log('reached');
    return a1;
}

let fn2 = () => {
    let output = fn1();
    console.log('b');
    console.log(output);
}

fn2();