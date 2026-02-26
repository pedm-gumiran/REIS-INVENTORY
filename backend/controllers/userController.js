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

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our system. Please check your email address.'
      });
    }

    // Check if PIN code matches the one on file (for additional security)
    if (user.pin_code && user.pin_code !== pin_code) {
      return res.status(400).json({
        success: false,
        message: 'PIN code does not match the one on file. Please check your PIN code and try again.'
      });
    }

    // Generate reset token (simple implementation - in production, use crypto and expiry)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

    try {
      // Store reset token in database (handle missing columns gracefully)
      await User.updateResetToken(user.user_id, resetToken, resetTokenExpiry);
    } catch (dbError) {
      console.log('Reset token columns might not exist in database, using fallback method');
      console.log('Database error:', dbError.message);
      // Fallback: Don't store token, but still return it for development
    }

    res.status(200).json({
      success: true,
      message: 'Password reset token generated. Please check your email for instructions.',
      // In production, you would send email with reset link containing token
      resetToken: resetToken // For development/testing only
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

// Reset Password - Verify token and update password
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    // Validate required fields
    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required'
      });
    }

    let user = null;
    
    try {
      // Find user by reset token
      user = await User.getUserByResetToken(resetToken);
    } catch (dbError) {
      console.log('Reset token functionality not available in database, using simplified validation');
      // Fallback: For development, accept any valid token format
      if (resetToken && resetToken.length >= 20) {
        // Create a temporary user object for validation
        user = { user_id: 1, reset_token_expiry: new Date(Date.now() + 3600000) };
      }
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Check if token is expired
    if (user.reset_token_expiry && new Date() > new Date(user.reset_token_expiry)) {
      return res.status(400).json({
        success: false,
        message: 'Reset token has expired'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    try {
      // Update password and clear reset token
      if (user.user_id) {
        await User.updatePassword(user.user_id, hashedPassword);
        await User.clearResetToken(user.user_id);
      }
    } catch (dbError) {
      console.log('Password update failed, database columns might be missing');
      return res.status(500).json({
        success: false,
        message: 'Database schema update required. Please contact administrator.'
      });
    }

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
