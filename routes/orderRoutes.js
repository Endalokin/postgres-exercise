import express from "express";
import { getOrders } from "../controller/orderController.js";
import {query, body} from 'express-validator'

const router = express.Router();

const require_full_profile = [
    body('price').notEmpty(),
    body('date').notEmpty(), 
    body('user_id').notEmpty()
]


router.get("/", getOrders.getOrders);
router.get("/:id", getOrders.getSingleOrder);
router.post("/", require_full_profile, getOrders.createOrder)
router.put("/:id", require_full_profile, getOrders.updateOrder)
router.delete("/:id", getOrders.deleteOrder)

export default router;