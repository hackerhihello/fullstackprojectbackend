const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get User Profile (for Regular User)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Users List (Paginated)
const getUsersList = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    let users;
    if (req.user.role === 'admin') {
      users = await User.find().skip(skip).limit(limit);
    } else {
      users = await User.find({ _id: req.user.id }).skip(skip).limit(limit);
    }

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update User (Username, Password, Active Status)
const updateUser = async (req, res) => {
  const { username, password, active } = req.body;
  const userId = req.params.userId;

  try {
    // Ensure that only the user themselves or an admin can update
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this user' });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update fields if provided
    if (username) user.username = username;
    if (password) {
      // Hash the new password before saving
      user.password = await bcrypt.hash(password, 10);
    }
    if (active !== undefined) user.active = active;

    // Save updated user
    await user.save();

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProfile, getUsersList, updateUser };
