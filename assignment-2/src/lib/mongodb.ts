import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error('❌  MONGODB_URI missing in .env');

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectToMongo() {
  if (cached.conn) return cached.conn;      // reuse on hot‑reload

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((m) => m);
  }
  cached.conn = await cached.promise;
  if (process.env.NODE_ENV !== 'production') (global as any).mongoose = cached;
  return cached.conn;
}
export default connectToMongo;
