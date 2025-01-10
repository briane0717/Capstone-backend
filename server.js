import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "morgan";
import cors from "cors";

dotenv.config();

// Connect to MongoDB
import db from "./db/conn.mjs";
//Set up port
const PORT = process.env.PORT || 5050;

//Create app
const app = express();

//Middleware
app.use(cors());
app.use(logger("dev"));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
