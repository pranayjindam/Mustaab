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
import multer from "multer";

const upload = multer({ dest: "uploads/" }); // or configure storage as needed

// For creating return requests with images
returnRequestRouter.post("/", AuthenticateUser, upload.array("images"), createRequest);
returnRequestRouter.get("/my", AuthenticateUser, getMyRequests);

returnRequestRouter.get("/", AuthenticateAdmin, getAllRequests);
returnRequestRouter.put("/:id/status", AuthenticateAdmin, updateStatus);

export default returnRequestRouter;
