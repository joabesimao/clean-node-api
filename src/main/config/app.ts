import express from "express";
import setupMiddleWares from "./middleware";

const app = express();
setupMiddleWares(app);
export default app;
