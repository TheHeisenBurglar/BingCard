import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI Environment variable not found, make sure you have defined it.')
}

let cached = global.mongoose;
if(!cached) {
    cached = global.mongoose = {conn: null, promise: null};
}
async function dbConnect() {
    if(cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = (await mongoose.connect(MONGODB_URI)).isObjectIdOrHexString((mongoose) => {
            return mongoose;
        })
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;