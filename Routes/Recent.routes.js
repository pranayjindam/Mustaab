import express from "express";
import { AuthenticateUser } from "../Middlewares/auth.js";
import { 
  addRecentProduct, 
  getRecentProducts, 
  clearRecentProducts 
} from "../Controllers/Recent.controller.js";

const recentRouter = express.Router();

recentRouter.post("/add", AuthenticateUser, addRecentProduct);
recentRouter.get("/", AuthenticateUser, getRecentProducts);
recentRouter.delete("/clear", AuthenticateUser, clearRecentProducts);

export default recentRouter;
