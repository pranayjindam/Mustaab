import express from "express";
import {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateStatus,
} from "../Controllers/ReturnRequest.controller.js";
import { AuthenticateUser, AuthenticateAdmin } from "../Middlewares/auth.js";

const returnRequestRouter = express.Router();

// User
returnRequestRouter.post("/",AuthenticateUser , createRequest);
returnRequestRouter.get("/my", AuthenticateUser, getMyRequests);

returnRequestRouter.get("/", AuthenticateAdmin, getAllRequests);
returnRequestRouter.put("/:id/status", AuthenticateAdmin, updateStatus);

export default returnRequestRouter;
