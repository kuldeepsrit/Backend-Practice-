import  express from "express";

import {
  register,
  login,
  refresh,
  logout
} from "../controllers/auth.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/refresh", refresh);
router.post("/logout", logout);

router.get("/dashboard", protect, (req, res) => {
  res.json({ message: "Welcome to dashboard", userId: req.user });
});

export default  router ;



// REGISTER

