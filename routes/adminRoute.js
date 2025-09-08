const express = require("express");
const router = express.Router();

const { signUp, signIn } = require("../controllers/adminController");

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/admins", (req, res) => {
  console.log("Admin listing");
  res.status(200).send("listingg");
});

module.exports = router;
