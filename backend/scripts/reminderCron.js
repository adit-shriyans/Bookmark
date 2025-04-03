import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

/**
 * This script is designed to be run as a cron job to send reminder emails
 * for books that are due soon. It uses the admin API to trigger the reminders.
 * 
 * Example cron job (runs daily at 9am):
 * 0 9 * * * node /path/to/backend/scripts/reminderCron.js
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpassword';
const DAYS_THRESHOLD = 3; // Remind about books due in 3 days

// Generate a JWT token for admin authentication
function generateAdminToken() {
  const adminPayload = {
    id: 1, // This should be your actual admin ID
    email: ADMIN_EMAIL,
    role: 'admin'
  };
  
  return jwt.sign(
    adminPayload,
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '1h' }
  );
}

async function sendReminders() {
  try {
    const token = generateAdminToken();
    
    console.log(`[${new Date().toISOString()}] Starting reminder job for books due in ${DAYS_THRESHOLD} days...`);
    
    const response = await axios.post(
      `${API_URL}/api/loans/send-reminders?days=${DAYS_THRESHOLD}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`[${new Date().toISOString()}] Reminder job completed. Results:`, response.data);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error sending reminders:`, error.response?.data || error.message);
  }
}

// Execute the reminders function
sendReminders(); 