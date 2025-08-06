import {
  registerAdmin,
  deleteAdmin,
  updateAdmin,
  getAdminDetails,
} from "../Services/Admin.service.js";

// Register admin route handler
export const handleAdminRegister = async (req, res) => {
  try {
    const admin = await registerAdmin(req.body);
    res.status(201).json({ success: true, admin });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update admin
export const handleAdminUpdate = async (req, res) => {
  try {
    const updated = await updateAdmin(req.user._id, req.body);
    res.status(200).json({ success: true, admin: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get admin details
export const handleAdminDetails = async (req, res) => {
  try {
    const admin = await getAdminDetails(req.user._id);
    res.status(200).json({ success: true, admin });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const handleAdminDelete=async (req,res) => {
  try{
    const admin=await deleteAdmin(req.user._id);
       res.status(200).json({ success: true, admin:deleted });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
}
