import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByEmail, createUser } from '../models/userModel.js';

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }
    
    // Create new 
    const newUser = await createUser(name, email, password);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: newUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await getUserByEmail(email);
    console.log(email, password)
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '30d' }
    );
    
    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export {
  register,
  login
}; 