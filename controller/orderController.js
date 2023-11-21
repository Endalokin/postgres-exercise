import { validationResult } from "express-validator";
import { pool } from "../db/db.js";

function validateRequest (req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.json({ errors: result.array() });
      return true;
    }
}

export const getOrders = {
  getOrders: (req, res) => {
    pool
      .query("select * from orders")
      .then((data) => res.json(data.rows))
      .catch((err) => res.status(500).json({ msg: "ooops", err }));
  },

  createOrder: (req, res) => {
    if (validateRequest (req, res)) {
        console.log("creation canceled")
        return;
    }
    console.log("creation check complete")
    const { price, date, user_id } = req.body;
    const queryTxt =
      "insert into orders (price, date, user_id) values ($1, $2, $3)";
    const values = [price, date, user_id];
    const msg = "order created";
    const msgError = "order creation failed";
    pool
      .query(queryTxt, values)
      .then((data) => res.status(201).json({ msg: msg, data }))
      .catch((err) => res.status(500).json({ msg: msgError, err }));
  },

  getSingleOrder: (req, res) => {
    const { id } = req.params;
    const queryTxt = "select * from orders where id = $1";
    const values = [id];
    const msgError = `can't get single order`;
    pool
      .query(queryTxt, values)
      .then((data) => res.status(200).json(data.rows))
      .catch((err) => res.status(500).json({ msg: msgError, err }));
  },

  updateOrder: (req, res) => {
    if (validateRequest (req, res)) {
        console.log("update canceled")
        return;
    }
    const { id } = req.params;
    console.log(req.body);
    const { price, date, user_id } = req.body;
    const queryTxt =
      "update orders set price=$2, date=$3, user_id=$4 where id = $1";
    console.log(queryTxt);
    const values = [id, price, date, user_id];
    console.log(values);
    const msg = `order with id ${id} updated`;
    const msgError = `order update failed`;
    pool
      .query(queryTxt, values)
      .then((data) => res.status(200).json({ msg: msg, data }))
      .catch((err) => res.status(500).json({ msg: msgError, err }));
  },

  deleteOrder: (req, res) => {
    const { id } = req.params;
    const queryTxt = "delete from orders where id = $1";
    const values = [id];
    const msg = `order with id ${id} deleted`;
    const msgError = `order deletion failed`;
    pool
      .query(queryTxt, values)
      .then((data) => res.status(200).json({ msg: msg, data }))
      .catch((err) => res.status(500).json({ msg: msgError, err }));
  },
};
