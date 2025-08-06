import * as AddressService from "../Services/Address.service.js";

// Create
export const createAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const newAddress = await AddressService.createAddress(userId, req.body);
    res.status(201).json({ message: "Address created", address: newAddress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read All
export const getAddresses = async (req, res) => {
  try {
    const userId = req.user._id;
    const addresses = await AddressService.getAddresses(userId);
    res.json({ addresses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read One
export const getAddressById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;
    const address = await AddressService.getAddressById(addressId, userId);
    if (!address) return res.status(404).json({ error: "Address not found" });
    res.json({ address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update
export const updateAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;
    const updated = await AddressService.updateAddress(addressId, userId, req.body);
    if (!updated) return res.status(404).json({ error: "Address not found" });
    res.json({ message: "Address updated", address: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;
    const deleted = await AddressService.deleteAddress(addressId, userId);
    if (!deleted) return res.status(404).json({ error: "Address not found" });
    res.json({ message: "Address deleted", address: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Set Default
export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.body;

    if (!addressId) {
      return res.status(400).json({ error: "Address ID is required" });
    }

    const updated = await AddressService.setDefaultAddress(addressId, userId);
    if (!updated) {
      return res.status(404).json({ error: "Address not found or doesn't belong to user" });
    }

    res.json({ message: "Default address set", address: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
