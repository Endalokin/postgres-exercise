import express from "express";
import { getUsers } from "../controller/userGetController.js";
import {query, body} from 'express-validator'

const router = express.Router();

const require_full_profile = [
    body('first_name').notEmpty(),
    body('last_name').notEmpty(),
    body('age').notEmpty(),
    body('active').notEmpty()
]


router.get("/", getUsers.getUsers);
router.get("/:id", getUsers.getSingleUser);
router.post("/", require_full_profile, getUsers.createUser)
router.put("/:id", require_full_profile, getUsers.updateUser)
router.delete("/:id", getUsers.deleteUser)
router.get("/:id/orders", getUsers.getOrders)
router.put("/:id/check-inactive", getUsers.updateActivity)

export default router;
