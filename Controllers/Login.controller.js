import User from "../Models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { identifier, password } = req.body;
  console.log("req.body is:", req.body);

  try {
    console.log("identifier is", identifier);

    // ✅ Search by email OR mobile
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }]
    });

    console.log("user is", user);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password." });
    }

    // ✅ Sign JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
        mobile: user.mobile,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
