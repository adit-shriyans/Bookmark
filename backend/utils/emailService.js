import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send book checkout notification
async function sendCheckoutNotification(user, book, loan) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Library Book Checkout Confirmation',
    html: `
      <h2>Book Checkout Confirmation</h2>
      <p>Hello ${user.name},</p>
      <p>This email confirms that you have borrowed the following book from the library:</p>
      <div style="margin: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Checkout Date:</strong> ${new Date(loan.issue_date).toLocaleDateString()}</p>
        <p><strong>Due Date:</strong> ${new Date(loan.due_date).toLocaleDateString()}</p>
        <p><strong>Student ID:</strong> ${user.college_id || 'N/A'}</p>
      </div>
      <p>Please return this book by the due date to avoid late fees.</p>
      <p>Thank you for using our library services!</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Checkout email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending checkout email:', error);
    return false;
  }
}

// Send book return notification
async function sendReturnNotification(user, book, loan) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Library Book Return Confirmation',
    html: `
      <h2>Book Return Confirmation</h2>
      <p>Hello ${user.name},</p>
      <p>This email confirms that you have returned the following book to the library:</p>
      <div style="margin: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Return Date:</strong> ${new Date(loan.return_date).toLocaleDateString()}</p>
        <p><strong>Student ID:</strong> ${user.college_id || 'N/A'}</p>
      </div>
      <p>Thank you for returning the book ${loan.due_date < loan.return_date ? 'on time' : 'promptly'}!</p>
      <p>We hope you enjoyed the book and look forward to serving you again.</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Return email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending return email:', error);
    return false;
  }
}

// Send due date reminder
async function sendDueDateReminder(user, book, loan, daysRemaining) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Library Book Due in ${daysRemaining} Days`,
    html: `
      <h2>Book Due Date Reminder</h2>
      <p>Hello ${user.name},</p>
      <p>This is a reminder that the following book is due in <strong>${daysRemaining} days</strong>:</p>
      <div style="margin: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Due Date:</strong> ${new Date(loan.due_date).toLocaleDateString()}</p>
        <p><strong>Student ID:</strong> ${user.college_id || 'N/A'}</p>
      </div>
      <p>Please return this book by the due date to avoid late fees.</p>
      <p>Thank you for using our library services!</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Due date reminder email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending due date reminder email:', error);
    return false;
  }
}

// Send overdue notification with late fees
async function sendOverdueNotification(user, book, loan, daysOverdue, lateFee) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Library Book Overdue Notice',
    html: `
      <h2>Book Overdue Notice</h2>
      <p>Hello ${user.name},</p>
      <p>The following book is <strong>${daysOverdue} days overdue</strong>:</p>
      <div style="margin: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #fff4f4;">
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Due Date:</strong> ${new Date(loan.due_date).toLocaleDateString()}</p>
        <p><strong>Days Overdue:</strong> ${daysOverdue}</p>
        <p><strong>Late Fee:</strong> $${lateFee.toFixed(2)}</p>
        <p><strong>Student ID:</strong> ${user.college_id || 'N/A'}</p>
      </div>
      <p>Please return this book as soon as possible to avoid additional late fees.</p>
      <p>Current library policy charges $0.50 per day for overdue books.</p>
      <p>Thank you for your prompt attention to this matter.</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Overdue notification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending overdue notification email:', error);
    return false;
  }
}

export {
  sendCheckoutNotification,
  sendReturnNotification,
  sendDueDateReminder,
  sendOverdueNotification
}; 