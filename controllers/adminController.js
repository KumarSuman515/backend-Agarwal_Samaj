const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminUser = require("../models/adminModel");

exports.signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if email already exists
    const existingUser = await AdminUser.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // create user
    const newUser = await AdminUser.create({
      username,
      email,
      password_hash,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await AdminUser.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // compare password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid Credentials" });

    // create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token,
      role:user.role
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// 👥 Get all users (optional)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await AdminUser.findAll({
      attributes: ["id", "username", "email", "role", "created_at"],
    });
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};