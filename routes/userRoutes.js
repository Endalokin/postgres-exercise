import express from "express";
import { getUsers } from "../controller/userGetController.js";

const router = express.Router();

router.get("/", getUsers.getUsers);

export default router;
