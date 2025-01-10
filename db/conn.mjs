// Imports
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

//Glbal configuration
const mongoURI = process.env.MONGO_URI;
const db = mongoose.connection;

//connect to mongo
mongoose.connect(mongoURI);
mongoose.connection.once("open", () => {
  console.log("connected to mongo");
});
export default db;
