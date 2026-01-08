const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
const transporter = require('../mailer');

const crypto = require("crypto");

// DB pool (move credentials to .env if desired)
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "anushka_handcraft"
});

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
// });

// --- Registration ---
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || username.length < 2 || username.length > 20)
    return res.status(400).json({ error: "Username must be 2-20 chars." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: "Invalid email address." });
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password))
    return res.status(400).json({ error: "Strong password required." });

  const [users] = await db.query(
    "SELECT id FROM users WHERE email=? OR username=?",
    [email, username]
  );
  if (users.length)
    return res.status(409).json({ error: "Email or username already registered." });

  const hashed = await bcrypt.hash(password, 12);
  await db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashed]
  );
  res.json({ success: true });
};


// --- Login ---
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Fields required." });
  const [users] = await db.query(
    "SELECT id, username, email, password FROM users WHERE email=?",
    [email]
  );
  if (!users.length)
    return res.status(401).json({ error: "Invalid credentials." });
  const user = users[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials." });

  const isAdmin =
    user.email === "pathakmansi608@gmail.com" && password === "123456789";
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: isAdmin ? "admin" : "user",
    },
    process.env.JWT_SECRET || "your_jwt_secret",
    { expiresIn: "1d" }
  );
  res.json({
    access_token: token,
    username: user.username,
    email: user.email,
    role: isAdmin ? "admin" : "user",
  });
};


// --- Forgot Password ---
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: "Valid email required." });

  const [users] = await db.query(
    "SELECT id, username FROM users WHERE email = ?",
    [email]
  );
  if (!users.length)
    return res.status(404).json({ error: "User not found." });

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry
  await db.query(
    "UPDATE users SET reset_token=?, reset_token_expiry=? WHERE email=?",
    [token, expiry, email]
  );

  const resetUrl = `http://localhost:3000/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Link",
    html: `
      <p>Hi ${users[0].username},</p>
      <p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 15 minutes.</p>
    `,
  });

  res.json({ success: true });
};


// --- Reset Password ---
exports.resetPassword = async (req, res) => {
  const { email, token, password } = req.body;
  if (!email || !token || !password)
    return res.status(400).json({ error: "Missing data." });
  const [users] = await db.query(
    "SELECT reset_token_expiry FROM users WHERE email=? AND reset_token=?",
    [email, token]
  );
  if (!users.length)
    return res.status(400).json({ error: "Invalid token or email." });
  if (new Date(users[0].reset_token_expiry) < new Date())
    return res.status(400).json({ error: "Expired token." });

  const hashed = await bcrypt.hash(password, 12);
  await db.query(
    "UPDATE users SET password=?, reset_token=null, reset_token_expiry=null WHERE email=?",
    [hashed, email]
  );
  res.json({ success: true });
};
