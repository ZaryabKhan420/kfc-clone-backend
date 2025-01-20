const express = require("express");
const {
  saveUserInfo,
  checkUserExists,
  updateUser,
  uploadImage,
} = require("../controllers/userController.js");
const authenticate = require("../middleware/authenticate.js");
const upload = require("../middleware/multer.js");
const router = express.Router();

router.post("/save-info", saveUserInfo);
router.post("/check-user", checkUserExists);
router.route("/update-user").post(
  upload.fields([
    {
      name: "userImage",
      maxCount: 1,
    },
  ]),
  updateUser
);

module.exports = router;
