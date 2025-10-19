const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc Register new user
// @route POST /api/users/register
// @access Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, specialization, semester, skills, interests } = req.body;

    // 🧩 Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    // 🔍 Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // ✅ Create user (password auto-hashed by pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      specialization,
      semester,
      skills,
      interests,
    });

    return res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Register Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc Login user
// @route POST /api/users/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Please enter both email and password' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: 'Invalid email or password' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: 'Invalid email or password' });

    return res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    return res.json({ success: true, user });
  } catch (error) {
    console.error('Profile Fetch Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
};

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    // Update allowed fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.specialization = req.body.specialization || user.specialization;
    user.semester = req.body.semester || user.semester;
    user.skills = req.body.skills || user.skills;
    user.interests = req.body.interests || user.interests;

    const updatedUser = await user.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        specialization: updatedUser.specialization,
        semester: updatedUser.semester,
        skills: updatedUser.skills,
        interests: updatedUser.interests,
      },
    });
  } catch (error) {
    console.error('Profile Update Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
