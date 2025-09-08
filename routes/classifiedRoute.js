const express = require("express");
const router = express.Router();
const classifiedController = require("../controllers/classifiedController");
const upload = require("../middlewares/uploadMiddleware");
const { validateClassified, validateClassifiedUpdate } = require("../middlewares/classifiedValidation");
const authenticateAdmin = require("../middlewares/authenticateAdmin");

// User API
router.post(
  "/register",
  upload.fields([{ name: 'photos', maxCount: 5 }]),
  validateClassified,
  classifiedController.registerListing
);
router.get("/status/:contact", classifiedController.getStatus);
router.get("/search", classifiedController.searchListings);
router.get("/:id", classifiedController.getListingById);

// Admin API (protected)
router.get("/pending", authenticateAdmin, classifiedController.getPendingListings);
router.put("/:id/approve", authenticateAdmin, classifiedController.approveListing);
router.put("/:id/disapprove", authenticateAdmin, classifiedController.disapproveListing);

module.exports = router;
