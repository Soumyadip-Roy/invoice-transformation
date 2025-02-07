const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { processDocuments } = require("../controllers/documentController");
const multer = require("multer");

router.post("/process", (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ status: "error", message: err.message });
    } else if (err) {
      return res.status(500).json({ status: "error", message: err.message });
    }
    processDocuments(req.files, res);
  });
});

module.exports = router;
