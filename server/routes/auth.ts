import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbGet, dbRun } from "../database.js";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "walmart-perishables-secret";

export const register: RequestHandler = async (req, res) => {
  try {
    const { email, password, name, role = "associate", storeId } = req.body;

    // Check if user already exists
    const existingUser = await dbGet("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const userId = uuidv4();
    await dbRun(
      "INSERT INTO users (id, email, password_hash, name, role, store_id) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, email, passwordHash, name, role, storeId],
    );

    // Generate JWT
    const token = jwt.sign({ userId, email, role, storeId }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        email,
        name,
        role,
        storeId,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await dbGet("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        storeId: user.store_id,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        storeId: user.store_id,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
};

export const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
};

export const getProfile: RequestHandler = async (req: any, res) => {
  try {
    const user = await dbGet(
      "SELECT id, email, name, role, store_id FROM users WHERE id = ?",
      [req.user.userId],
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
};

export const updateProfile: RequestHandler = async (req: any, res) => {
  try {
    const { name } = req.body;

    await dbRun("UPDATE users SET name = ? WHERE id = ?", [
      name,
      req.user.userId,
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// Create default admin user if none exists
export async function createDefaultAdmin() {
  try {
    const adminExists = await dbGet(
      "SELECT id FROM users WHERE role = 'admin'",
    );

    if (!adminExists) {
      const passwordHash = await bcrypt.hash("admin123", 12);
      const adminId = uuidv4();

      await dbRun(
        "INSERT INTO users (id, email, password_hash, name, role, store_id) VALUES (?, ?, ?, ?, ?, ?)",
        [
          adminId,
          "admin@walmart.com",
          passwordHash,
          "System Administrator",
          "admin",
          "1234",
        ],
      );

      console.log("Default admin user created:");
      console.log("Email: admin@walmart.com");
      console.log("Password: admin123");
    }
  } catch (error) {
    console.error("Error creating default admin:", error);
  }
}
