import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

console.log('🔍 MongoDB Connection Debug:');
console.log('URI exists:', !!MONGODB_URI);
console.log('URI length:', MONGODB_URI?.length);
console.log('URI preview:', MONGODB_URI?.substring(0, 50) + '...');

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// @ts-ignore
let cached = global.mongoose;

if (!cached) {
  // @ts-ignore
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    console.log('✅ Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('🔄 Creating new MongoDB connection...');
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully!');
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    console.error('❌ MongoDB connection error:', e.message);
    console.error('Error code:', e.code);
    console.error('Error name:', e.name);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
