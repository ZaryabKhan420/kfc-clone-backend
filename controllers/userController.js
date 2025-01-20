const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const uploadOnCloudinary = require("../utils/cloudinary.js");
require("dotenv").config();

exports.saveUserInfo = async (req, res) => {
  const { phone, firstName, lastName, email, dateOfBirth, gender, userImage } =
    req.body;
  try {
    let user = new User({
      phone,
      firstName,
      lastName,
      email,
      dateOfBirth,
      gender,
      userImage,
    });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "User information saved successfully",
      user: {
        fistName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user?.gender,
        userImage: user?.userImage,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving user information",
      error,
    });
  }
};

exports.checkUserExists = async (req, res) => {
  const { phone } = req.body;

  try {
    const user = await User.findOne({ phone });

    if (user) {
      return res
        .status(200)
        .json({ success: true, userExists: true, user: user });
    } else {
      return res.status(200).json({ success: true, userExists: false });
    }
  } catch (error) {
    console.error("Error checking user existence:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error checking user existence" });
  }
};

exports.updateUser = async (req, res) => {
  const { firstName, lastName, email, dateOfBirth, gender, phone } = req.body;

  try {
    let imageUrl = "";

    const userImageLocalPath = req.files?.userImage?.[0]?.path;
    if (userImageLocalPath) {
      const uploadResult = await uploadOnCloudinary(userImageLocalPath);
      imageUrl = uploadResult?.secure_url || "";
    }

    // Update the user in the database
    const user = await User.findOneAndUpdate(
      { phone },
      {
        firstName,
        lastName,
        email,
        dateOfBirth,
        gender,
        userImage: imageUrl,
      },
      { new: true }
    );
    if (user) {
      return res.status(200).json({ success: true, user });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error updating user" });
  }
};
