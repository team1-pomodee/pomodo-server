import express from "express";
const router = express.Router();

import {
  register,
  login,
  updateUser,
  addCycle,
} from "../controllers/authController.js";

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/updateUser").patch(updateUser);
router.route("/addCycle").patch(addCycle);

export default router;
