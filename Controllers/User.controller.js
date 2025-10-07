import * as userService from "../Services/User.service.js";

// 🔹 Get profile of logged-in user
export const profile = async (req, res) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load profile" });
  }
};

// 🔹 Update logged-in user
export const updateUser = async (req, res) => {
  try {
    const result = await userService.updateUser(req.user._id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Delete logged-in user
export const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.user._id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
