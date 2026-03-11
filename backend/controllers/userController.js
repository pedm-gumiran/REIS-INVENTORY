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

exports.getUserCount = async (req, res) => {
  try {
    const count = await User.getUserCount();
    res.status(200).json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get user count' });
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
      data: { email: email }
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

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Return user data without password
    const userResponse = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
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
    const { email, newPassword, currentPassword } = req.body;

    // Validate required fields
    if (!email || !newPassword || email.trim() === '' || newPassword.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Email and new password are required'
      });
    }

    // Trim email to remove whitespace
    const trimmedEmail = email.trim();

    // Find user by email
    const user = await User.getUserByEmail(trimmedEmail);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Always check if new password is same as current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }

    // If currentPassword is provided, verify it's correct
    if (currentPassword) {
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Validate hashed password was created
    if (!hashedPassword) {
      return res.status(500).json({
        success: false,
        message: 'Failed to hash password'
      });
    }

    // Update password using email as identifier
    await User.updatePasswordByEmail(trimmedEmail, hashedPassword);

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
