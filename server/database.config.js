const DATABASE_NAME = 'voxellian';
const MONGODB_URI = `mongodb://localhost:27017/${DATABASE_NAME}`;

const config = {
  mongodbUri: process.env.MONGODB_URI || MONGODB_URI,
  options: {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    autoReconnect: true,
  }
};

export default config;