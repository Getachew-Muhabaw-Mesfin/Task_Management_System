const express = require("express");
const { signup } = require("../../controllers/userManagement/authController");

const router = express.Router();

router.post("/signup", signup);
