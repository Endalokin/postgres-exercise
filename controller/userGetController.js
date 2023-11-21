import { validationResult } from "express-validator";
import { pool } from "../db/db.js";

function validateRequest(req, res) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.json({ errors: result.array() });
    return true;
  }
}

export const getUsers = {
  getUsers: (req, res) => {
    pool
      .query("select * from users")
      .then((data) => res.json(data.rows))
      .catch((err) => res.status(500).json({ msg: "ooops", err }));
  },

  createUser: (req, res) => {
    if (validateRequest(req, res)) {
      console.log("creation canceled");
      return;
    }
    console.log("creation check complete");
    const { first_name, last_name, age, active } = req.body;
    const queryTxt =
      "insert into users (first_name, last_name, age, active) values ($1, $2, $3, $4)";
    const values = [first_name, last_name, age, active];
    const msg = "user created";
    const msgError = "user creation failed";
    pool
      .query(queryTxt, values)
      .then((data) => res.status(201).json({ msg: msg, data }))
      .catch((err) => res.status(500).json({ msg: msgError, err }));
  },

  getSingleUser: (req, res) => {
    const { id } = req.params;
    const queryTxt = "select * from users where id = $1";
    const values = [id];
    const msgError = `can't get single user`;
    pool
      .query(queryTxt, values)
      .then((data) => res.status(200).json(data.rows))
      .catch((err) => res.status(500).json({ msg: msgError, err }));
  },

  updateUser: (req, res) => {
    if (validateRequest(req, res)) {
      console.log("update canceled");
      return;
    }
    const { id } = req.params;
    console.log(req.body);
    const { first_name, last_name, age, active } = req.body;
    const queryTxt =
      "update users set first_name=$2, last_name=$3, age=$4, active=$5 where id = $1";
    console.log(queryTxt);
    const values = [id, first_name, last_name, age, active];
    console.log(values);
    const msg = `user with id ${id} updated`;
    const msgError = `user update failed`;
    pool
      .query(queryTxt, values)
      .then((data) => res.status(200).json({ msg: msg, data }))
      .catch((err) => res.status(500).json({ msg: msgError, err }));
  },

  deleteUser: (req, res) => {
    const { id } = req.params;
    const queryTxt = "delete from users where id = $1";
    const values = [id];
    const msg = `user with id ${id} deleted`;
    const msgError = `user deletion failed`;
    pool
      .query(queryTxt, values)
      .then((data) => res.status(200).json({ msg: msg, data }))
      .catch((err) => res.status(500).json({ msg: msgError, err }));
  },

  getOrders: (req, res) => {
    const { id } = req.params;
    const queryTxt = "select * from orders where user_id = $1";
    const values = [id];
    const msgError = `can't get orders from single user`;
    pool
      .query(queryTxt, values)
      .then((data) => res.status(200).json(data.rows))
      .catch((err) => res.status(500).json({ msg: msgError, err }));
  },

  updateActivity: (req, res) => {
    const { id } = req.params;
    const queryTxtcheck =
      "select users.id, users.active, count(orders.id) from users left join orders on users.id = orders.user_id where users.id = $1 group by users.id";
    const queryTxtUpdate = "update users set active=$2 where id=$1";

    pool
    .query(queryTxtcheck, [id])
    .then((data) => {
      const isActive = data.rows[0].count > 0;
      const activeState = data.rows[0].active;
      const needsUpdate = isActive != activeState;
      if (needsUpdate) {
        pool
          .query(queryTxtUpdate, [id, !activeState])
          .then((data) => res.status(200).json({ msg: "user updated", data }))
          .catch((err) =>
            res.json({ msg: "failed to update user activity", err })
          );
      } else {
        res.status(200).json({ msg: "no update needed" });
      }
    })
    .catch(err => res.json({ msg: "failed to check user activity", err }))
  },
};
