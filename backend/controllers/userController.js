const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, pin_code } = req.body;

    // Validate required fields (excluding user_id since it's auto-increment)
    if (!first_name || !last_name || !email || !password || !pin_code) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required including PIN code'
      });
    }

    // Validate PIN code format (6 digits)
    if (!/^\d{6}$/.test(pin_code)) {
      return res.status(400).json({
        success: false,
        message: 'PIN code must be exactly 6 digits'
      });
    }

    // Check if email already exists
    const existingEmail = await User.getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user (user_id is auto-increment, don't send it)
    const userId = await User.createUser({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      pin_code: pin_code // Add PIN code to user creation
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { userId }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Forgot Password - Generate reset token
exports.forgotPassword = async (req, res) => {
  try {
    const { email, pin_code } = req.body;

    // Validate required fields
    if (!email || !pin_code) {
      return res.status(400).json({
        success: false,
        message: 'Email and PIN code are required'
      });
    }

    // Validate PIN code format (6 digits)
    if (!/^\d{6}$/.test(pin_code)) {
      return res.status(400).json({
        success: false,
        message: 'PIN code must be exactly 6 digits'
      });
    }

    // Check if user exists by email (since user_id is auto-increment, we can't use it for lookup)
    let user = null;
    try {
      user = await User.getUserByEmail(email);
    } catch (dbError) {
      console.log('Database error when fetching user by email:', dbError.message);
      return res.status(500).json({
        success: false,
        message: 'Database error. Please contact administrator.'
      });
    }

    // Check if user exists and PIN matches
    if (!user || user.pin_code !== parseInt(pin_code)) {
      return res.status(400).json({
        success: false,
        message: 'Email or Pincode is not valid! Please Try Again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Account verified successfully. Please proceed to reset your password.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process forgot password request',
      error: error.message
    });
  }
};

// Reset Password - Verify email, then update password
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Validate required fields
    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email and new password are required'
      });
    }

    // Find user by email
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await User.updatePassword(user.user_id, hashedPassword);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message
    });
  }
};
