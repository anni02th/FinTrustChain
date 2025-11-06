import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  try {
    const dbUri = process.env.MONGO_URI;

    if (!dbUri) {
      console.error("🔴 DB_URI is not defined in your .env file");
      process.exit(1);
    }

    // Attempt to connect to the database
    const conn = await mongoose.connect(dbUri);

    console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`🔴 Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
