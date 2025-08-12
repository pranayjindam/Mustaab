import * as userService from "../Services/User.service.js";

// Register
export const register = async (req, res) => {
  try {
    const result = await userService.registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Profile
export const profile = async (req, res) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load profile" });
  }
};

// Update
export const update = async (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.user:", req.user);
  try {
    const result = await userService.updateUser(req.user._id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Delete
export const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.user._id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
