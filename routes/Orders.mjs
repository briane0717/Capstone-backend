import express from "express";
import cartController from "../controllers/cart.mjs";
const router = express.router();

router.get("/", cartController);
