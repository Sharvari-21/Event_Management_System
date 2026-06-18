const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateMiddleware");
const { registerValidator, loginValidator } = require("../validators/authValidator");

router.post("/register", registerValidator, validateRequest, registerUser);
router.post("/login", loginValidator, validateRequest, loginUser);
router.get("/me", protect, getMe);

module.exports = router;