import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export default async function globalSetup() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  global.__MONGOD__ = mongod;
  process.env.MONGODB_TEST_URI = uri;
  
  await mongoose.connect(uri);
}