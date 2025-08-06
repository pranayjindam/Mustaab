import Address from "../Models/Address.model.js";

// Add a new address (and optionally make it default)
export const createAddress = async (userId, addressData) => {
  if (addressData.isDefault) {
    // Set all existing addresses as non-default
    await Address.updateMany({ userId }, { $set: { isDefault: false } });
  }

  const newAddress = new Address({ ...addressData, userId });
  return await newAddress.save();
};

// Get all addresses for a user
export const getAddresses = async (userId) => {
  return await Address.find({ userId }).sort({ createdAt: -1 });
};

// Update an address
export const updateAddress = async (addressId, userId, updatedData) => {
  if (updatedData.isDefault) {
    // Unset previous default
    await Address.updateMany({ userId }, { $set: { isDefault: false } });
  }

  return await Address.findOneAndUpdate(
    { _id: addressId, userId },
    updatedData,
    { new: true }
  );
};

// Delete an address
export const deleteAddress = async (addressId, userId) => {
  return await Address.findOneAndDelete({ _id: addressId, userId });
};

// Set an address as default

export const setDefaultAddress = async (addressId, userId) => {
  // 1. Verify address belongs to user
  const targetAddress = await Address.findOne({ _id: addressId, userId });
  if (!targetAddress) return null;

  // 2. Unset existing default address for user
  await Address.updateMany({ userId, isDefault: true }, { isDefault: false });

  // 3. Set new default address
  targetAddress.isDefault = true;
  await targetAddress.save();

  return targetAddress;
};


// Get single address
export const getAddressById = async (addressId, userId) => {
  return await Address.findOne({ _id: addressId, userId });
};
