import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    console.error('MongoDB error: MONGODB_URI (or MONGO_URI) is not defined in .env');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB error: ${error.message}`);
    console.error('Check that MongoDB is running and your connection string in server/.env is correct.');
    process.exit(1);
  }
};

export default connectDB;
