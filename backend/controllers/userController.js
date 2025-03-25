import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/users.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import sgMail from '@sendgrid/mail';
import fetch from 'node-fetch';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const url = process.env.CLIENT_URL;

const ALTCHA_SECRET = process.env.ALTCHA_SECRET;

// const verifyAltcha = async (payload) => {
//   try {
//     const response = await fetch('https://eu.altcha.org/api/v1/verify', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization:
//           'Bearer csec_1678511082c29cf278bf563768155eec33beb23983aa9813',
//       },
//       body: JSON.stringify({ payload }),
//     });
//     const result = await response.json();
//     console.log(result);
//     return result.verified;
//   } catch (error) {
//     console.error('ALTCHA verification error:', error);
//     return false;
//   }
// };

const verifyAltcha = async (payload) => {
  console.log('Raw ALTCHA payload:', payload);
  try {
    if (typeof payload !== 'string') {
      console.log('Payload is not a string:', typeof payload);
      return false;
    }

    let decodedData;
    try {
      decodedData = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    } catch (e) {
      console.log('Failed to decode payload as base64:', e.message);
      return false;
    }
    console.log('Decoded ALTCHA payload:', decodedData);

    const {
      algorithm = 'SHA-256',
      challenge,
      salt,
      number,
      signature,
      test,
    } = decodedData;

    if (!challenge || !salt || number === undefined) {
      console.log('Missing required fields (challenge, salt, or number)');
      return false;
    }

    const verificationData = `${challenge}.${salt}.${number}`;
    console.log('verificationData:', verificationData);

    const hash = crypto
      .createHash(algorithm.toLowerCase())
      .update(verificationData)
      .digest('hex');
    console.log('SHA hash of verificationData:', hash);

    const hmac = crypto
      .createHmac(algorithm.toLowerCase(), ALTCHA_SECRET)
      .update(hash)
      .digest('hex');
    console.log('Computed HMAC signature:', hmac);
    console.log('Received signature:', signature);

    // Only bypass in development with test mode
    if (test && !signature && process.env.NODE_ENV === 'development') {
      console.log(
        'Test mode detected, accepting empty signature in development'
      );
      return true;
    }

    if (!signature) {
      console.log('Signature missing in non-test mode');
      return false;
    }

    const isValid = hmac === signature;
    console.log('Signature valid:', isValid);
    return isValid;
  } catch (error) {
    console.error('ALTCHA verification error:', error);
    return false;
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const registerUser = asyncHandler(async (req, res) => {
  console.log('req.body:', req.body);
  const { username, email, password, altcha } = req.body;

  if (!altcha) {
    res.status(400);
    throw new Error('ALTCHA verification payload is missing');
  }

  const isAltchaVerified = await verifyAltcha(altcha);
  if (!isAltchaVerified) {
    res.status(400);
    throw new Error('Verification failed. Please complete the CAPTCHA.');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    username,
    email,
    password,
  });
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const msg = {
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: 'Password Reset Request',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.

      Please click on the following link, or paste this into your browser to complete the process:

      ${url}/reset-password/${token} 

      If you did not request this, please ignore this email and your password will remain unchanged.`,
      html: `You are receiving this because you (or someone else) have requested the reset of the password for your account.

      Please click on the following link, or paste this into your browser to complete the process:

      ${url}/reset-password/${token} 

      If you did not request this, please ignore this email and your password will remain unchanged.`,
    };
    await sgMail.send(msg);

    res.status(200).json({
      message: `An e-mail has been sent to ${email} with further instructions.`,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (user) {
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } else {
    res.status(404);
    throw new Error('Password reset token is invalid or has expired.');
  }
});

export {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
};
