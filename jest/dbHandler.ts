const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Listen = require("../src/models/listen");

const sampleData = require("../jest/sampleData");

const mongod = new MongoMemoryServer();

module.exports.connect = async () => {
  const uri = await mongod.getConnectionString();
  const mongooseOpts = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  };

  await mongoose.connect(uri, mongooseOpts);

  await Promise.all(
    sampleData.sampleData.map(async (datum: any) => {
      const res = new Listen(datum);
      await res.save();
    })
  );
};

module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
