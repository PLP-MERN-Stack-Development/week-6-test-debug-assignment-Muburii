import mongoose from 'mongoose';

export default async function globalTeardown() {
  await mongoose.connection.close();
  await global.__MONGOD__.stop();
}