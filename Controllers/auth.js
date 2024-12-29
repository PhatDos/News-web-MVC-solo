import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../Models/user.js"; // Assuming the userSchema is in the 'models/user.js' file

// Secret key for JWT
const JWT_SECRET = "secret";
// Register Route
export async function register(username, email, phone, loginName, password) {
  try {
    // Check if the user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      phone,
      loginName,
      password
    });

    // Save the new user
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function login(username, password) {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return { status: 400, message: "Invalid username or password" };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { status: 400, message: "Invalid username or password" };
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { status: 200, token, role: user.role };
  } catch (err) {
    console.error(err);
    return { status: 500, message: "Server error" };
  }
}
