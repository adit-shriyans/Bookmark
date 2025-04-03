import { getAllUsers as _getAllUsers, getUserById, updateUserRole as _updateUserRole } from '../models/userModel.js';

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await _getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be "admin" or "user".' });
    }
    
    // Check if user exists
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user role
    await _updateUserRole(id, role);
    
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error while updating user role' });
  }
};

export {
  getAllUsers,
  updateUserRole
}; 